import * as pot from "@pagopa/ts-commons/lib/pot";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";
import { OperationListDTO } from "../../../../../../definitions/idpay/OperationListDTO";
import { OperationTypeEnum as TransactionOperationTypeEnum } from "../../../../../../definitions/idpay/TransactionOperationDTO";
import { VSpacer } from "../../../../../components/core/spacer/Spacer";
import { Body } from "../../../../../components/core/typography/Body";
import { H3 } from "../../../../../components/core/typography/H3";
import { LabelSmall } from "../../../../../components/core/typography/LabelSmall";
import { IOStyles } from "../../../../../components/core/variables/IOStyles";
import I18n from "../../../../../i18n";
import {
  AppParamsList,
  IOStackNavigationProp
} from "../../../../../navigation/params/AppParamsList";
import { useIOSelector } from "../../../../../store/hooks";
import { IDPayDetailsRoutes } from "../navigation";
import {
  idpayOperationListSelector,
  idpayPaginatedTimelineSelector
} from "../store";
import { useTimelineDetailsBottomSheet } from "./TimelineDetailsBottomSheet";
import {
  TimelineOperationListItem,
  TimelineOperationListItemSkeleton
} from "./TimelineOperationListItem";

const styles = StyleSheet.create({
  spaceBetween: {
    justifyContent: "space-between"
  }
});

const emptyTimelineContent = (
  <>
    <H3>
      {I18n.t(
        "idpay.initiative.details.initiativeDetailsScreen.configured.yourOperations"
      )}
    </H3>
    <VSpacer size={8} />
    <LabelSmall weight="Regular" color="bluegreyDark">
      {I18n.t(
        "idpay.initiative.details.initiativeDetailsScreen.configured.yourOperationsSubtitle"
      )}
      <LabelSmall weight="SemiBold">
        {I18n.t(
          "idpay.initiative.details.initiativeDetailsScreen.configured.yourOperationsLink"
        )}
      </LabelSmall>
    </LabelSmall>
  </>
);

type Props = {
  initiativeId: string;
};

const ConfiguredInitiativeData = (props: Props) => {
  const { initiativeId } = props;

  const navigation = useNavigation<IOStackNavigationProp<AppParamsList>>();

  const detailsBottomSheet = useTimelineDetailsBottomSheet(initiativeId);

  const paginatedTimelinePot = useIOSelector(idpayPaginatedTimelineSelector);
  const timeline = useIOSelector(idpayOperationListSelector);
  const isLoading = pot.isLoading(paginatedTimelinePot);

  const navigateToOperationsList = () => {
    navigation.navigate(IDPayDetailsRoutes.IDPAY_DETAILS_MAIN, {
      screen: IDPayDetailsRoutes.IDPAY_DETAILS_TIMELINE,
      params: {
        initiativeId
      }
    });
  };

  const showOperationDetailsBottomSheet = (operation: OperationListDTO) => {
    if (operation.operationType === TransactionOperationTypeEnum.TRANSACTION) {
      // Currently we only show details for transaction operations
      detailsBottomSheet.present(operation.operationId);
    }
  };

  const renderTimelineContent = () => {
    if (isLoading) {
      return Array.from({ length: 3 }).map((_, index) => (
        <TimelineOperationListItemSkeleton key={index} />
      ));
    }

    if (timeline.length === 0) {
      return emptyTimelineContent;
    }

    return (
      <>
        {timeline.slice(0, 3).map(operation => (
          <TimelineOperationListItem
            key={operation.operationId}
            operation={operation}
            onPress={() => showOperationDetailsBottomSheet(operation)}
          />
        ))}
      </>
    );
  };

  return (
    <>
      <View style={[IOStyles.row, styles.spaceBetween]}>
        <H3>
          {I18n.t(
            "idpay.initiative.details.initiativeDetailsScreen.configured.yourOperations"
          )}
        </H3>
        <Body weight="SemiBold" color="blue" onPress={navigateToOperationsList}>
          {I18n.t(
            "idpay.initiative.details.initiativeDetailsScreen.configured.settings.showMore"
          )}
        </Body>
      </View>
      <VSpacer size={8} />
      {renderTimelineContent()}
      {detailsBottomSheet.bottomSheet}
    </>
  );
};

export default ConfiguredInitiativeData;
