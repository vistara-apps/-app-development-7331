import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

/**
 * Hook for Farcaster Hub API integration
 * Provides user identity and social features
 */
export function useFarcaster() {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Farcaster Hub API base URL
  const HUB_API_URL = 'https://hub-api.farcaster.xyz:2281';

  // Get user profile by FID (Farcaster ID)
  const getUserProfile = useCallback(async (fid) => {
    if (!fid) return null;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(`${HUB_API_URL}/v1/userDataByFid`, {
        params: { fid }
      });

      if (response.data && response.data.messages) {
        const userData = {};
        
        response.data.messages.forEach(message => {
          if (message.data?.userDataBody) {
            const { type, value } = message.data.userDataBody;
            switch (type) {
              case 'USER_DATA_TYPE_DISPLAY':
                userData.displayName = value;
                break;
              case 'USER_DATA_TYPE_BIO':
                userData.bio = value;
                break;
              case 'USER_DATA_TYPE_PFP':
                userData.pfpUrl = value;
                break;
              case 'USER_DATA_TYPE_USERNAME':
                userData.username = value;
                break;
              case 'USER_DATA_TYPE_URL':
                userData.url = value;
                break;
            }
          }
        });

        setUserProfile({
          fid,
          ...userData
        });

        return userData;
      }
    } catch (err) {
      console.error('Error fetching Farcaster profile:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }

    return null;
  }, []);

  // Get user's recent casts
  const getUserCasts = useCallback(async (fid, limit = 10) => {
    if (!fid) return [];

    try {
      const response = await axios.get(`${HUB_API_URL}/v1/castsByFid`, {
        params: { fid, pageSize: limit }
      });

      if (response.data && response.data.messages) {
        return response.data.messages.map(message => ({
          hash: message.hash,
          text: message.data?.castAddBody?.text || '',
          timestamp: new Date(message.data?.timestamp * 1000),
          mentions: message.data?.castAddBody?.mentions || [],
          embeds: message.data?.castAddBody?.embeds || []
        }));
      }
    } catch (err) {
      console.error('Error fetching user casts:', err);
    }

    return [];
  }, []);

  // Search for users by username
  const searchUsers = useCallback(async (query) => {
    if (!query) return [];

    try {
      // Note: This is a simplified search - in production you'd use a proper search endpoint
      const response = await axios.get(`${HUB_API_URL}/v1/userNameProofsByName`, {
        params: { name: query }
      });

      if (response.data && response.data.proofs) {
        return response.data.proofs.map(proof => ({
          fid: proof.fid,
          username: proof.name,
          timestamp: new Date(proof.timestamp * 1000)
        }));
      }
    } catch (err) {
      console.error('Error searching users:', err);
    }

    return [];
  }, []);

  // Cast a message (requires proper authentication in production)
  const createCast = useCallback(async (text, parentCastHash = null) => {
    // Note: This is a placeholder - actual casting requires proper Farcaster authentication
    // and signing with the user's private key
    console.log('Cast creation requested:', { text, parentCastHash });
    
    // In a real implementation, you would:
    // 1. Create the cast message
    // 2. Sign it with the user's private key
    // 3. Submit to the Farcaster Hub
    
    throw new Error('Cast creation requires proper Farcaster authentication');
  }, []);

  // Get cast by hash
  const getCast = useCallback(async (castHash) => {
    if (!castHash) return null;

    try {
      const response = await axios.get(`${HUB_API_URL}/v1/castById`, {
        params: { hash: castHash }
      });

      if (response.data && response.data.message) {
        const message = response.data.message;
        return {
          hash: message.hash,
          fid: message.data?.fid,
          text: message.data?.castAddBody?.text || '',
          timestamp: new Date(message.data?.timestamp * 1000),
          mentions: message.data?.castAddBody?.mentions || [],
          embeds: message.data?.castAddBody?.embeds || []
        };
      }
    } catch (err) {
      console.error('Error fetching cast:', err);
    }

    return null;
  }, []);

  // Get user's followers count
  const getFollowersCount = useCallback(async (fid) => {
    if (!fid) return 0;

    try {
      const response = await axios.get(`${HUB_API_URL}/v1/linksByFid`, {
        params: { fid, link_type: 'follow' }
      });

      return response.data?.messages?.length || 0;
    } catch (err) {
      console.error('Error fetching followers count:', err);
      return 0;
    }
  }, []);

  // Share legal content to Farcaster
  const shareLegalContent = useCallback(async (content) => {
    const shareText = `📚 Just learned about "${content.title}" on RightCheck! 

${content.description}

Know your rights! 🛡️ #RightCheck #LegalRights`;

    // In a real implementation, this would create a cast
    // For now, we'll just prepare the content
    return {
      text: shareText,
      embeds: content.url ? [{ url: content.url }] : []
    };
  }, []);

  return {
    userProfile,
    isLoading,
    error,
    getUserProfile,
    getUserCasts,
    searchUsers,
    createCast,
    getCast,
    getFollowersCount,
    shareLegalContent
  };
}
