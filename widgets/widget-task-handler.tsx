import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { HelloWidget } from './HelloWidget';

const nameToWidget = {
  Hello: HelloWidget, // must match the `name` you set in app.json
};

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const WidgetComponent =
    nameToWidget[props.widgetInfo.widgetName as keyof typeof nameToWidget];

  if (!WidgetComponent) return;

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
      props.renderWidget(<WidgetComponent />);
      break;
    default:
      break;
  }
}