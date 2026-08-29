import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export function HelloWidget() {
  return (
    <FlexWidget
      clickAction="OPEN_APP" // ← special built-in action, opens your app
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#222222',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TextWidget
        text="Open App"
        style={{ fontSize: 18, color: '#ffffff' }}
      />
    </FlexWidget>
  );
}