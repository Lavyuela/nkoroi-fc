import { Linking, Share } from 'react-native';

export const shareToWhatsApp = async (message) => {
  try {
    const whatsappUrl = `whatsapp://send?text=${encodeURIComponent(message)}`;
    const canOpen = await Linking.canOpenURL(whatsappUrl);
    
    if (canOpen) {
      await Linking.openURL(whatsappUrl);
      return { success: true };
    } else {
      // Fallback to regular share if WhatsApp not installed
      await Share.share({ message });
      return { success: true };
    }
  } catch (error) {
    console.log('Error sharing to WhatsApp:', error);
    // Fallback to regular share
    try {
      await Share.share({ message });
      return { success: true };
    } catch (shareError) {
      return { success: false, error: 'Failed to share' };
    }
  }
};

export const formatMatchUpdate = (match, eventType = 'created') => {
  const messages = {
    created: `⚽ *New Match Scheduled*\n\n${match.homeTeam} vs ${match.awayTeam}\n📍 ${match.venue}\n📅 ${new Date(match.matchDate).toLocaleString()}\n\n_Stay tuned for live updates!_`,
    started: `🏁 *Match Started!*\n\n${match.homeTeam} vs ${match.awayTeam}\n📍 ${match.venue}\n\n_Follow live on Nkoroi FC Live Score App_`,
    goal: `⚽ *GOAL!*\n\n${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}\n\n_Live updates on Nkoroi FC App_`,
    finished: `🏆 *Full Time*\n\n${match.homeTeam} ${match.homeScore} - ${match.awayScore} ${match.awayTeam}\n\n_Match Report on Nkoroi FC App_`,
  };
  
  return messages[eventType] || messages.created;
};

export const formatTeamUpdate = (title, content, type) => {
  const typeEmoji = {
    announcement: '📢',
    training: '🏃',
    match: '⚽',
    injury: '🏥'
  };

  return `${typeEmoji[type]} *Nkoroi FC Update*\n\n*${title}*\n\n${content}\n\n_Posted via Nkoroi FC Live Score App_`;
};
