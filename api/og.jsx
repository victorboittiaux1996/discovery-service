import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1B10FD',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              fontSize: 80,
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-0.05em',
              marginBottom: 20,
            }}
          >
            DISCOVERY SERVICE
          </h1>
          <p
            style={{
              fontSize: 32,
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            Weekly Service Post Inclusion & Spotify Growth
          </p>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
