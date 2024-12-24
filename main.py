from models.gemini_model import GeminiModel
import step_1 as next_step

if __name__ == "__main__":

    # Instantiate your AI model
    ai_model = GeminiModel()

    # call step 1
    next_step.step_1(ai_model)

    # model test
    #print(ai_model.generate_response("What is the capital of France?"))
    
