// ImageKitProvider.js
import { IKContext } from 'imagekitio-react';

const ImageKitProvider = ({ children }) => {
  return (
    <IKContext
      urlEndpoint="https://ik.imagekit.io/ldhzgky9pk"
      publicKey="public_Y9ne/saJW/xkRygZ4ZR/GXn6W9Q="
      authenticator={async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/imagekit`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          const data = await response.json();
          
          if (!data.token || !data.signature || !data.expire) {
            throw new Error('Incomplete authentication data');
          }

          return data;
        } catch (error) {
          console.error('ImageKit auth error:', error);
          throw error;
        }
      }}
    >
      {children}
    </IKContext>
  );
};

export default ImageKitProvider;