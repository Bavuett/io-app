import { IOColors, IconButton } from "@pagopa/io-app-design-system";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React from "react";
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ToolEnum } from "../../../../definitions/content/AssistanceToolConfig";
import { BaseHeader } from "../../../components/screens/BaseHeader";
import {
  ContextualHelpProps,
  ContextualHelpPropsMarkdown
} from "../../../components/screens/BaseScreenComponent";
import FocusAwareStatusBar from "../../../components/ui/FocusAwareStatusBar";
import { TabItem } from "../../../components/ui/TabItem";
import { TabNavigation } from "../../../components/ui/TabNavigation";
import I18n from "../../../i18n";
import {
  AppParamsList,
  IOStackNavigationProp
} from "../../../navigation/params/AppParamsList";
import { useIODispatch, useIOSelector } from "../../../store/hooks";
import { canShowHelpSelector } from "../../../store/reducers/assistanceTools";
import { assistanceToolConfigSelector } from "../../../store/reducers/backendStatus";
import { currentRouteSelector } from "../../../store/reducers/navigation";
import { FAQsCategoriesType } from "../../../utils/faq";
import { isAndroid } from "../../../utils/platform";
import {
  assistanceToolRemoteConfig,
  resetCustomFields
} from "../../../utils/supportAssistance";
import { zendeskSupportStart } from "../../zendesk/store/actions";
import { useIOBarcodeCameraScanner } from "../hooks/useIOBarcodeCameraScanner";
import { IOBarcode, IOBarcodeFormat, IOBarcodeType } from "../types/IOBarcode";
import { BarcodeFailure } from "../types/failure";
import { CameraPermissionView } from "./CameraPermissionView";

type HelpProps = {
  contextualHelp?: ContextualHelpProps;
  contextualHelpMarkdown?: ContextualHelpPropsMarkdown;
  faqCategories?: ReadonlyArray<FAQsCategoriesType>;
  hideHelpButton?: boolean;
};

type Props = {
  /**
   * Accepted barcoded formats that can be detected. Leave empty to accept all formats.
   * If the format is not supported it will return an UNSUPPORTED_FORMAT error
   */
  barcodeFormats?: Array<IOBarcodeFormat>;
  /**
   * Accepted barcode types that can be detected. Leave empty to accept all types.
   * If the type is not supported it will return an UNKNOWN_CONTENT error
   */
  barcodeTypes?: Array<IOBarcodeType>;
  /**
   * Callback called when a barcode is successfully decoded
   */
  onBarcodeSuccess: (barcodes: Array<IOBarcode>) => void;
  /**
   * Callback called when a barcode is not successfully decoded
   */
  onBarcodeError: (failure: BarcodeFailure) => void;
  /**
   * Callback called when the upload file input is pressed, necessary to show the file input modal
   */
  onFileInputPressed: () => void;
  /**
   * Callback called when the manual input button is pressed
   * necessary to navigate to the manual input screen or show the manual input modal
   */
  onManualInputPressed: () => void;
} & HelpProps;

const BarcodeScanBaseScreenComponent = ({
  barcodeFormats,
  barcodeTypes,
  onBarcodeError,
  onBarcodeSuccess,
  onFileInputPressed,
  onManualInputPressed,
  faqCategories,
  contextualHelp,
  contextualHelpMarkdown,
  hideHelpButton
}: Props) => {
  const isFocused = useIsFocused();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<IOStackNavigationProp<AppParamsList>>();

  const currentScreenName = useIOSelector(currentRouteSelector);

  const dispatch = useIODispatch();
  const assistanceToolConfig = useIOSelector(assistanceToolConfigSelector);
  const canShowHelp = useIOSelector(canShowHelpSelector);
  const choosenTool = assistanceToolRemoteConfig(assistanceToolConfig);

  const onShowHelp = (): (() => void) | undefined => {
    switch (choosenTool) {
      case ToolEnum.zendesk:
        // The navigation param assistanceForPayment is fixed to false because in this entry point we don't know the category yet.
        return () => {
          resetCustomFields();
          dispatch(
            zendeskSupportStart({
              faqCategories,
              contextualHelp,
              contextualHelpMarkdown,
              startingRoute: currentScreenName,
              assistanceForPayment: false,
              assistanceForCard: false,
              assistanceForFci: false
            })
          );
        };
      case ToolEnum.instabug:
      case ToolEnum.web:
      case ToolEnum.none:
        return undefined;
    }
  };

  const canShowHelpButton = () => {
    if (hideHelpButton || !canShowHelp) {
      return false;
    } else {
      return contextualHelp || contextualHelpMarkdown;
    }
  };

  const {
    cameraComponent,
    cameraPermissionStatus,
    requestCameraPermission,
    openCameraSettings,
    hasTorch,
    isTorchOn,
    toggleTorch
  } = useIOBarcodeCameraScanner({
    onBarcodeSuccess: barcode => onBarcodeSuccess([barcode]),
    onBarcodeError,
    barcodeFormats,
    barcodeTypes,
    disabled: !isFocused
  });

  const customGoBack = (
    <IconButton
      icon="closeLarge"
      onPress={navigation.goBack}
      accessibilityLabel={I18n.t("global.buttons.close")}
      color="contrast"
    />
  );

  const openAppSetting = React.useCallback(async () => {
    // Open the custom settings if the app has one
    await openCameraSettings();
  }, [openCameraSettings]);

  const renderCameraView = () => {
    if (cameraPermissionStatus === "authorized") {
      return cameraComponent;
    }

    if (cameraPermissionStatus === "not-determined") {
      return (
        <CameraPermissionView
          title={I18n.t("barcodeScan.permissions.undefined.title")}
          body={I18n.t("barcodeScan.permissions.undefined.label")}
          action={{
            label: I18n.t("barcodeScan.permissions.undefined.action"),
            accessibilityLabel: I18n.t(
              "barcodeScan.permissions.undefined.action"
            ),
            onPress: requestCameraPermission
          }}
        />
      );
    }

    return (
      <CameraPermissionView
        title={I18n.t("barcodeScan.permissions.denied.title")}
        body={I18n.t("barcodeScan.permissions.denied.label")}
        action={{
          label: I18n.t("barcodeScan.permissions.denied.action"),
          accessibilityLabel: I18n.t("barcodeScan.permissions.denied.action"),
          onPress: openAppSetting
        }}
      />
    );
  };

  const shouldDisplayTorchButton =
    cameraPermissionStatus === "authorized" && hasTorch;

  const torchIconButton: React.ComponentProps<
    typeof BaseHeader
  >["customRightIcon"] = {
    iconName: isTorchOn ? "lightFilled" : "light",
    accessibilityLabel: isTorchOn
      ? I18n.t("accessibility.buttons.torch.turnOff")
      : I18n.t("accessibility.buttons.torch.turnOn"),
    onPress: toggleTorch
  };

  return (
    <View style={[styles.screen, { paddingBottom: insets.bottom }]}>
      <View style={styles.cameraContainer}>{renderCameraView()}</View>
      <View style={styles.navigationContainer}>
        <TabNavigation tabAlignment="stretch" selectedIndex={0} color="dark">
          <TabItem
            label={I18n.t("barcodeScan.tabs.scan")}
            accessibilityLabel={I18n.t("barcodeScan.tabs.a11y.scan")}
          />
          <TabItem
            label={I18n.t("barcodeScan.tabs.upload")}
            accessibilityLabel={I18n.t("barcodeScan.tabs.a11y.upload")}
            onPress={onFileInputPressed}
          />
          <TabItem
            label={I18n.t("barcodeScan.tabs.input")}
            accessibilityLabel={I18n.t("barcodeScan.tabs.a11y.input")}
            onPress={onManualInputPressed}
          />
        </TabNavigation>
      </View>
      <LinearGradient
        colors={["#03134480", "#03134400"]}
        style={styles.headerContainer}
      >
        <SafeAreaView
          style={{
            // Apparently, on Android, with translucent status bar SafeAreaView doesn't work as expected
            paddingTop: Platform.OS === "android" ? insets.top : 0
          }}
        >
          {/* FIXME: replace with new header */}
          <BaseHeader
            dark={true}
            backgroundColor={"transparent"}
            goBack={true}
            customGoBack={customGoBack}
            onShowHelp={canShowHelpButton() ? onShowHelp() : undefined}
            customRightIcon={
              shouldDisplayTorchButton ? torchIconButton : undefined
            }
          />
          {/* This overrides BaseHeader status bar configuration */}
          <FocusAwareStatusBar
            barStyle={"light-content"}
            backgroundColor={isAndroid ? IOColors["blueIO-850"] : "transparent"}
            translucent={false}
          />
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: IOColors["blueIO-850"]
  },
  headerContainer: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: 160
  },
  cameraContainer: {
    flex: 1,
    flexGrow: 1,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  navigationContainer: {
    paddingVertical: 16
  }
});

export { BarcodeScanBaseScreenComponent };
