import React from 'react';
import { FlexWidget, TextWidget } from 'react-native-android-widget';

export function HelloWidget() {
  return (
    <FlexWidget
      clickAction="OPEN_APP"
      style={{
        height: 'match_parent',
        width: 'match_parent',
        backgroundColor: '#2E7D5B',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <TextWidget
        text="Breathe"
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          color: '#FFFFFF',
        }}
      />
    </FlexWidget>
  );
}