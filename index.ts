import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from './widgets/widget-task-handler';

// Must run synchronously, before expo-router's entry evaluates anything,
// so the headless widget task is registered even when Android launches
// the JS bundle with no UI (widget add/update/resize).
registerWidgetTaskHandler(widgetTaskHandler);

import 'expo-router/entry';