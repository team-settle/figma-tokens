import React from 'react';
import { useSelector } from 'react-redux';
import isEqual from 'lodash.isequal';
import Box from './Box';
import Blankslate from './Blankslate';
import AnnotationBuilder from './AnnotationBuilder';
import { SingleToken } from '@/types/tokens';
import useTokens from '../store/useTokens';
import { uiStateSelector } from '@/selectors';
import Stack from './Stack';

export default function InspectorDebugView({ resolvedTokens }: { resolvedTokens: SingleToken[] }) {
  const uiState = useSelector(uiStateSelector, isEqual);
  const { getTokenValue } = useTokens();

  function renderBlankslate() {
    if (uiState.selectedLayers > 1) return <Blankslate title="More than 1 layer selected" text="Select a single layer to see applied tokens" />;
    return <Blankslate title={uiState.selectedLayers === 1 ? 'No tokens found' : 'No layer selected'} text={uiState.selectedLayers === 1 ? 'Selected layer contains no tokens' : 'Select a layer to see applied tokens'} />;
  }

  return (
    <Box
      css={{ flexGrow: 1, padding: '$4' }}
      className="content scroll-container"
    >
      <Stack direction="column">
        <Box css={{ borderBottom: '1px solid $border', paddingBottom: '$4', marginBottom: '$4' }}>
          <AnnotationBuilder />
        </Box>

        {uiState.selectedLayers === 1 && Object.entries(uiState.mainNodeSelectionValues).length > 0
          ? (
            <Stack direction="column" gap={1}>
              {Object.entries(uiState.mainNodeSelectionValues)
                .filter(([, value]) => value !== 'delete')
                .map(([property, value]) => (
                  <Stack key={property} direction="row" align="start" justify="between">
                    <code className="flex flex-wrap space-x-2">
                      <div className="font-bold">{property}</div>
                      :
                      {' '}
                      <div className="p-1 text-white bg-gray-700 rounded text-xxs">
                        $
                        {typeof value === 'string' && value.split('.').join('-')}
                      </div>
                      <div className="text-gray-500 break-all">{`/* ${JSON.stringify(getTokenValue(value, resolvedTokens))} */`}</div>
                    </code>
                  </Stack>
                ))}
            </Stack>
          )
          : renderBlankslate()}
      </Stack>
    </Box>
  );
}
