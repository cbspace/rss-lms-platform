// app/icon.tsx
import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Icon generation function
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
            background: '#592468',
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '3px',
            borderRadius: '25%',
            padding: '6px',
        }}
      >
        {/* Three bars mimicking an RSS feed signal or content layers */}
        <div style={{ width: '18px', height: '3px', background: 'white', borderRadius: '2px' }} />
        <div style={{ width: '14px', height: '3px', background: 'rgba(255,255,255,0.8)', borderRadius: '2px', alignSelf: 'flex-start', marginLeft: '2px' }} />
        <div style={{ width: '10px', height: '3px', background: 'rgba(255,255,255,0.6)', borderRadius: '2px', alignSelf: 'flex-start', marginLeft: '2px' }} />
      </div>
    ),
    // ImageResponse options
    {
      ...size,
    }
  );
}