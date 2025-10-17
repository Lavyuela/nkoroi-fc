/**
 * Admin Notification Service
 * Functions for admins to send custom notifications to users
 */

let functions = null;
try {
  functions = require('@react-native-firebase/functions').default;
} catch (error) {
  console.warn('Firebase Functions not available:', error.message);
}

class AdminNotificationService {
  /**
   * Send a custom notification to all users subscribed to a topic
   * @param {string} title - Notification title
   * @param {string} body - Notification body
   * @param {string} topic - FCM topic (default: 'team_updates')
   * @param {string} channelId - Android notification channel (default: 'default')
   * @returns {Promise<Object>} Response from Cloud Function
   */
  async sendCustomNotification(title, body, topic = 'team_updates', channelId = 'default') {
    try {
      if (!functions) {
        throw new Error('Firebase Functions not available. Please update the app.');
      }

      console.log('📤 Sending custom notification...');
      console.log('Title:', title);
      console.log('Body:', body);
      console.log('Topic:', topic);

      const sendNotification = functions().httpsCallable('sendCustomNotification');
      
      const result = await sendNotification({
        title,
        body,
        topic,
        channelId,
      });

      console.log('✅ Notification sent successfully:', result.data);
      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      console.error('❌ Error sending custom notification:', error);
      
      // Handle specific errors
      if (error.code === 'unauthenticated') {
        throw new Error('You must be logged in to send notifications');
      } else if (error.code === 'permission-denied') {
        throw new Error('Only admins can send notifications');
      } else if (error.code === 'invalid-argument') {
        throw new Error('Title and body are required');
      }
      
      throw error;
    }
  }

  /**
   * Send a match announcement notification
   * @param {Object} match - Match details
   * @returns {Promise<Object>}
   */
  async sendMatchAnnouncement(match) {
    const title = '⚽ Upcoming Match!';
    const body = `${match.homeTeam} vs ${match.awayTeam} - ${match.date} at ${match.time}`;
    
    return this.sendCustomNotification(title, body, 'team_updates', 'match_updates');
  }

  /**
   * Send a team news notification
   * @param {string} newsTitle - News headline
   * @param {string} newsBody - News content
   * @returns {Promise<Object>}
   */
  async sendTeamNews(newsTitle, newsBody) {
    const title = `📢 ${newsTitle}`;
    const body = newsBody;
    
    return this.sendCustomNotification(title, body, 'team_updates', 'default');
  }

  /**
   * Send an urgent announcement
   * @param {string} message - Urgent message
   * @returns {Promise<Object>}
   */
  async sendUrgentAnnouncement(message) {
    const title = '🚨 Urgent Announcement';
    const body = message;
    
    return this.sendCustomNotification(title, body, 'team_updates', 'default');
  }

  /**
   * Send a match reminder (e.g., 1 hour before match)
   * @param {Object} match - Match details
   * @returns {Promise<Object>}
   */
  async sendMatchReminder(match) {
    const title = '⏰ Match Starting Soon!';
    const body = `${match.homeTeam} vs ${match.awayTeam} starts in 1 hour at ${match.venue}`;
    
    return this.sendCustomNotification(title, body, 'team_updates', 'match_updates');
  }

  /**
   * Send a celebration notification (e.g., after a win)
   * @param {string} message - Celebration message
   * @returns {Promise<Object>}
   */
  async sendCelebration(message) {
    const title = '🎉 Victory!';
    const body = message;
    
    return this.sendCustomNotification(title, body, 'team_updates', 'default');
  }
}

export default new AdminNotificationService();
