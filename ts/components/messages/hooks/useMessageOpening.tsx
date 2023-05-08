import * as pot from "@pagopa/ts-commons/lib/pot";
import { pipe } from "fp-ts/lib/function";
import * as O from "fp-ts/lib/Option";
import React, { useCallback, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import HeaderImage from "../../../../img/features/pn/pn_alert_header.svg";
import FooterWithButtons from "../../../components/ui/FooterWithButtons";
import { mixpanelTrack } from "../../../mixpanel";
import { UIMessage } from "../../../store/reducers/entities/messages/types";
import customVariables from "../../../theme/variables";
import { useIOBottomSheetModal } from "../../../utils/hooks/bottomSheet";
import { useIODispatch, useIOSelector } from "../../../store/hooks";
import {
  getMessagePrecondition,
  clearMessagePrecondition
} from "../../../store/actions/messages";
import { messagePreconditionSelector } from "../../../store/reducers/entities/messages/messagePrecondition";
import { getMessageById } from "../../../store/reducers/entities/messages/paginatedById";
import MessageMarkdown from "../../../components/messages/MessageDetail/MessageMarkdown";
import {
  RemoteValue,
  getValueOrElse,
  isLoading,
  isError,
  isReady
} from "../../../features/bonus/bpd/model/RemoteValue";
import { Pictogram } from "../../../components/core/pictograms";
import { IOStyles } from "../../../components/core/variables/IOStyles";
import { MessageCategoryPN } from "../../../../definitions/backend/MessageCategoryPN";
import I18n from "../../../i18n";
import { IOColors } from "../../../components/core/variables/IOColors";
import { VSpacer } from "../../../components/core/spacer/Spacer";
import { H2 } from "../../../components/core/typography/H2";
import { H4 } from "../../../components/core/typography/H4";
import { ThirdPartyMessagePrecondition } from "../../../../definitions/backend/ThirdPartyMessagePrecondition";
import LoadingSpinnerOverlay from "../../../components/LoadingSpinnerOverlay";
import ROUTES from "../../../navigation/routes";

const BOTTOM_SHEET_HEIGHT = 500;

const ErrorComponent = () => (
  <View style={[IOStyles.flex, IOStyles.alignCenter]}>
    <VSpacer size={24} />
    <Pictogram name="error" />
    <VSpacer size={24} />
    <H2 accessible>{I18n.t("global.genericError")}</H2>
    <VSpacer size={16} />
  </View>
);

type MessagePreconditionProps = {
  content: RemoteValue<ThirdPartyMessagePrecondition, Error>;
};

type MessagePreconditionContentProps = MessagePreconditionProps & {
  handleOnLoadEnd: () => void;
};

type MessagePreconditionFooterProps = {
  isContentLoadCompleted: boolean;
  messageId: string;
  onDismiss: () => void;
  navigationAction: (message: UIMessage) => void;
};

const MessagePreconditionFooter = (props: MessagePreconditionFooterProps) => {
  const message = useIOSelector(state =>
    getMessageById(state, props.messageId)
  );

  const handleCancelPress = () => {
    void mixpanelTrack("PN_DISCLAIMER_REJECTED");
    props.onDismiss();
  };

  const handleContinuePress = () => {
    props.onDismiss();

    pipe(
      message,
      pot.toOption,
      O.map(message => {
        pipe(
          message.category,
          MessageCategoryPN.decode,
          O.fromEither,
          O.chainNullableK(category => category.original_receipt_date),
          O.map(originalReceiptDate => {
            const notificationTimestamp = originalReceiptDate.toISOString();

            void mixpanelTrack("PN_DISCLAIMER_ACCEPTED", {
              eventTimestamp: new Date().toISOString(),
              messageTimestamp: message.createdAt.toISOString(),
              notificationTimestamp
            });
          })
        );
        props.navigationAction(message);
      })
    );
  };

  // if the markdown is not loaded yet
  // we don't render the footer
  if (!props.isContentLoadCompleted) {
    return <></>;
  }

  return (
    <FooterWithButtons
      type={"TwoButtonsInlineHalf"}
      leftButton={{
        bordered: true,
        labelColor: IOColors.blue,
        title: I18n.t("global.buttons.cancel"),
        onPressWithGestureHandler: true,
        onPress: handleCancelPress
      }}
      rightButton={{
        primary: true,
        labelColor: IOColors.white,
        title: I18n.t("global.buttons.continue"),
        onPressWithGestureHandler: true,
        onPress: handleContinuePress
      }}
    />
  );
};

const MessagePreconditionContent = ({
  content,
  handleOnLoadEnd
}: MessagePreconditionContentProps) => {
  const renderContent = () => {
    if (isError(content)) {
      return <ErrorComponent />;
    } else if (isReady(content)) {
      return (
        <MessageMarkdown onLoadEnd={handleOnLoadEnd}>
          {content.value.markdown}
        </MessageMarkdown>
      );
    }
    return null;
  };

  return (
    <View style={{ minHeight: "70%" }}>
      <LoadingSpinnerOverlay isLoading={isLoading(content)}>
        <VSpacer size={24} />
        {renderContent()}
      </LoadingSpinnerOverlay>
    </View>
  );
};

const MessagePreconditionHeader = ({ content }: MessagePreconditionProps) => {
  const data = getValueOrElse(content, undefined);

  return (
    <View style={[IOStyles.flex, IOStyles.row, IOStyles.alignCenter]}>
      {data ? (
        <>
          <HeaderImage
            width={32}
            height={32}
            fill={IOColors.blue}
            style={{ marginRight: customVariables.spacerWidth }}
          />
          <H4 weight="SemiBold" color="bluegreyDark">
            {data.title}
          </H4>
        </>
      ) : null}
    </View>
  );
};

export const useMessageOpening = () => {
  const navigation = useNavigation();
  const dispatch = useIODispatch();
  const { messageId: maybeMessageId, content } = useIOSelector(
    messagePreconditionSelector
  );
  const [isContentLoadCompleted, setIsContentLoadCompleted] =
    useState<boolean>(false);

  const navigate = useCallback(
    (message: UIMessage) => {
      navigation.navigate(ROUTES.MESSAGES_NAVIGATOR, {
        screen: ROUTES.MESSAGE_ROUTER_PAGINATED,
        params: {
          messageId: message.id,
          fromNotification: false
        }
      });
    },
    [navigation]
  );

  const modal = useIOBottomSheetModal(
    <MessagePreconditionContent
      content={content}
      handleOnLoadEnd={() => setIsContentLoadCompleted(true)}
    />,
    <MessagePreconditionHeader content={content} />,
    BOTTOM_SHEET_HEIGHT,
    pipe(
      maybeMessageId,
      O.fold(
        () => <></>,
        messageId => (
          <MessagePreconditionFooter
            isContentLoadCompleted={isContentLoadCompleted}
            messageId={messageId}
            onDismiss={() => modal.dismiss()}
            navigationAction={navigate}
          />
        )
      )
    ),
    () => {
      setIsContentLoadCompleted(false);
      dispatch(clearMessagePrecondition());
    }
  );

  const present = (message: UIMessage) => {
    if (message.hasPrecondition) {
      void mixpanelTrack("PN_DISCLAIMER_SHOW_SUCCESS");
      dispatch(getMessagePrecondition.request(message.id));
      modal.present();
      return;
    }

    navigate(message);
  };

  return { ...modal, present };
};
