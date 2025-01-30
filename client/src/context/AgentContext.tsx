import React, { createContext, useReducer, useContext, ReactNode, useEffect, useRef } from 'react';

// Define the shape of the state
interface AgentState {
  selectedAgent: string | null;
  isButtonActive: boolean; // Example state for a button
  isGenerating: boolean;
  isLoggedIn: boolean;
  isPosting: boolean;
  delayBetweenPosts: number; // Add delayBetweenPosts to the state
  timeLeft: number; // Add timeLeft to the state
  hasPosted: boolean; // Track if the first post has been made
}

// Define the actions
type Action = 
  | { type: 'SET_AGENT'; payload: string }
  | { type: 'TOGGLE_BUTTON'; payload: boolean }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_LOGGED_IN'; payload: boolean }
  | { type: 'SET_POSTING'; payload: boolean }
  | { type: 'SET_DELAY'; payload: number } // Action to set delayBetweenPosts
  | { type: 'SET_TIME_LEFT'; payload: number }
  | { type: 'SET_HAS_POSTED'; payload: boolean }; // Action to set hasPosted

// Create the context
const AgentContext = createContext<{
  state: AgentState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

// Define the reducer
const agentReducer = (state: AgentState, action: Action): AgentState => {
  console.log(`[Agentcontext] - agentReducer called with state: ${JSON.stringify(state)} and action: ${JSON.stringify(action)}`);
  switch (action.type) {
    case 'SET_AGENT':
      return { ...state, selectedAgent: action.payload };
    case 'TOGGLE_BUTTON':
      return { ...state, isButtonActive: action.payload };
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload };
    case 'SET_LOGGED_IN':
      return { ...state, isLoggedIn: action.payload };
    case 'SET_POSTING':
      return { ...state, isPosting: action.payload };
    case 'SET_DELAY':
      return { ...state, delayBetweenPosts: action.payload };
    case 'SET_TIME_LEFT':
      return { ...state, timeLeft: action.payload };
    case 'SET_HAS_POSTED':
      return { ...state, hasPosted: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// Create a provider component
export const AgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(agentReducer, { 
    selectedAgent: null,
    isButtonActive: false, // Initialize the button state
    isGenerating: false,
    isLoggedIn: false,
    isPosting: false,
    delayBetweenPosts: 5, // Default delay of 5 minutes
    timeLeft: 300, // Default timeLeft in seconds (5 minutes)
    hasPosted: false // Initialize hasPosted to false
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Restore timeLeft from localStorage
    const savedTimeLeft = localStorage.getItem('timeLeft');
    if (savedTimeLeft) {
      dispatch({ type: 'SET_TIME_LEFT', payload: parseInt(savedTimeLeft, 10) });
    }
  }, []);

  useEffect(() => {
    // Save timeLeft to localStorage whenever it changes
    localStorage.setItem('timeLeft', state.timeLeft.toString());
  }, [state.timeLeft]);

  useEffect(() => {
    // Update timeLeft whenever delayBetweenPosts changes
    if (!state.hasPosted) {
      dispatch({ type: 'SET_TIME_LEFT', payload: state.delayBetweenPosts * 60 });
    }
  }, [state.delayBetweenPosts]);

  useEffect(() => {
    if (state.hasPosted) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      intervalRef.current = setInterval(() => {
        if (state.timeLeft > 0) {
          dispatch({ type: 'SET_TIME_LEFT', payload: state.timeLeft - 1 });
        } else {
          clearInterval(intervalRef.current!);
          dispatch({ type: 'SET_TIME_LEFT', payload: state.delayBetweenPosts * 60 });
          // Trigger a new post here
          // You can dispatch an action or call a function to handle posting
        }
      }, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [state.timeLeft, state.delayBetweenPosts, state.hasPosted]);

  return (
    <AgentContext.Provider value={{ state, dispatch }}>
      {children}
    </AgentContext.Provider>
  );
};

// Custom hook to use the AgentContext
export const useAgent = () => {
  // console.log("[Agentcontext] - useAgent hook called");
  const context = useContext(AgentContext);
  // console.log(`[Agentcontext] - useAgent hook called with context: ${JSON.stringify(context)}`);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
}; 