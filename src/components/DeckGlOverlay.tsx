import { useEffect, useMemo, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { GoogleMapsOverlay } from '@deck.gl/google-maps';
import type { LayersList, PickingInfo } from '@deck.gl/core';

export interface DeckGlOverlayProps {
  layers: LayersList;
  onHoverInfo?: (info: PickingInfo | null) => void;
  onClickInfo?: (info: PickingInfo) => void;
  onWebGLUnsupported?: (unsupported: boolean) => void;
}

function checkWebGL2Available(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    return Boolean(gl);
  } catch {
    return false;
  }
}

export const DeckGlOverlay = ({
  layers,
  onHoverInfo,
  onClickInfo,
  onWebGLUnsupported,
}: DeckGlOverlayProps) => {
  const map = useMap();
  const webglSupported = useMemo(() => checkWebGL2Available(), []);
  const onHoverRef = useRef(onHoverInfo);
  const onClickRef = useRef(onClickInfo);

  useEffect(() => {
    onHoverRef.current = onHoverInfo;
  }, [onHoverInfo]);

  useEffect(() => {
    onClickRef.current = onClickInfo;
  }, [onClickInfo]);

  useEffect(() => {
    onWebGLUnsupported?.(!webglSupported);
  }, [webglSupported, onWebGLUnsupported]);

  const deck = useMemo(() => {
    if (!webglSupported) return null;
    try {
      return new GoogleMapsOverlay({
        interleaved: true,
        pickingRadius: 12,
        onHover: (info) => {
          onHoverRef.current?.(info.object ? info : null);
        },
        onClick: (info) => {
          if (info.object) {
            onClickRef.current?.(info);
          }
        },
      });
    } catch {
      return null;
    }
  }, [webglSupported]);

  useEffect(() => {
    if (!deck || !map) return;
    try {
      deck.setMap(map);
    } catch {
      onWebGLUnsupported?.(true);
    }
    return () => {
      try {
        deck.setMap(null);
      } catch {
        // Ignore teardown errors
      }
    };
  }, [deck, map, onWebGLUnsupported]);

  useEffect(() => {
    if (!deck) return;
    try {
      deck.setProps({ layers });
    } catch {
      // Ignore layer sync errors if WebGL context is lost
    }
  }, [deck, layers]);

  return null;
};
