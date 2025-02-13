import { Agent } from '../interfaces/AgentInterfaces';
import { Season } from '../interfaces/SeasonInterfaces';
import { ProfileImageOption } from '../interfaces/AgentInterfaces';
export function createBlankAgent(): Agent {
  return {
    agent: {
      concept: '',
      agent_details: {
        backstory: '',
        communication_style: [],
        emojis: [],
        hashtags: [],
        name: '',
        personality: [],
        topic_expertise: [],
        universe: ''
      },
      ai_model: {
        memory_store: '',
        model_name: '',
        model_type: ''
      },
      connectors: {
        discord: false,
        telegram: false,
        twitter: false
      },
      tracker: {
        messages_sent: 0,
        total_interactions: 0,
        current_episode_number: 0,
        current_post_number: 0,
        current_season_number: 0,
        post_every_x_minutes: 0
      },
      seasons: [] as Season[],
      profile_image: {
        details: {
          url: '',
          image_id: '',
          generationId: ''
        }
      },
      profile_image_options: [] as ProfileImageOption[]
    }
  };
} 