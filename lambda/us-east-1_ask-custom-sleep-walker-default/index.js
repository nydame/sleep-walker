// Alexa Fact Skill - Sample for Beginners
/* eslint no-use-before-define: 0 */
// sets up dependencies
const Alexa = require("ask-sdk");
const i18n = require("i18next");
// connect to Dashbot
const sprintf = require("i18next-sprintf-postprocessor");
const dashbotAPIKey = "NcGfI7hRTiZLT67pPcghbdx5HzT8LHqEGLMes75L";
const dashbot = require("dashbot")(dashbotAPIKey).alexa;

// core functionality for fact skill

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "LaunchRequest";
  },
  async handle(handlerInput) {
    const attMan = handlerInput.attributesManager;
    const requestAttributes = attMan.getRequestAttributes();
    // capture help message in case repetition is requested
    const attributes = (await attMan.getPersistentAttributes()) || {};
    attributes.lastSpeech = requestAttributes.t("HELP_MESSAGE");
    attMan.setPersistentAttributes(attributes);
    await attMan.savePersistentAttributes();
    return handlerInput.responseBuilder
      .speak(
        requestAttributes.t("LAUNCH_MESSAGE") +
          requestAttributes.t("HELP_MESSAGE")
      )
      .withSimpleCard(
        requestAttributes.t("SKILL_NAME"),
        requestAttributes.t("LAUNCH_MESSAGE") +
          requestAttributes.t("HELP_MESSAGE")
      )
      .reprompt("O.K. let's try again." + requestAttributes.t("HELP_REPROMPT"))
      .getResponse();
  }
};

const RepeatHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.RepeatIntent"
    );
  },
  async handle(handlerInput) {
    const attMan = handlerInput.attributesManager;
    const requestAttributes = attMan.getRequestAttributes();
    const attributes = (await attMan.getPersistentAttributes()) || {};
    const speakOutput =
      attributes.lastSpeech || requestAttributes.t("NOTHING_TO_REPEAT");
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withSimpleCard(requestAttributes.t("SKILL_NAME"), speakOutput)
      .getResponse();
  }
};

const GetNewFactHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    // checks request type
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "GetNewFactIntent"
    );
  },
  async handle(handlerInput) {
    const attMan = handlerInput.attributesManager;
    const requestAttributes = attMan.getRequestAttributes();
    // gets a random fact by assigning an array to the variable
    // the random item from the array will be selected by the i18next library
    // the i18next library is set up in the Request Interceptor
    const randomFact = requestAttributes.t("FACTS");
    // // concatenates a standard message with the random fact
    const speakOutput = requestAttributes.t("GET_FACT_MESSAGE") + randomFact;
    // captures the last fact in case repetition is requested
    const attributes = (await attMan.getPersistentAttributes()) || {};
    attributes.lastSpeech = randomFact;
    attMan.setPersistentAttributes(attributes);
    await attMan.savePersistentAttributes();

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withSimpleCard(requestAttributes.t("SKILL_NAME"), randomFact)
      .getResponse();
  }
};

const StartRoutineHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "StartRoutineIntent"
    );
  },
  async handle(handlerInput) {
    const attMan = handlerInput.attributesManager;
    const requestAttributes = attMan.getRequestAttributes();
    // save step number
    const attributes = (await attMan.getPersistentAttributes()) || {};
    attributes.lastStep = 1;
    attMan.setPersistentAttributes(attributes);
    await attMan.savePersistentAttributes();
    // fetch step 1 content (based on calculation of current step number); save
    const step = requestAttributes.t("ROUTINE_STEP_START");
    attributes.lastSpeech = step;
    attMan.setPersistentAttributes(attributes);
    await attMan.savePersistentAttributes();

    return handlerInput.responseBuilder
      .speak(
        requestAttributes.t("START_ROUTINE_PREFIX") +
          step +
          requestAttributes.t("CONTINUE_ROUTINE_SUFFIX")
      )
      .withSimpleCard(
        requestAttributes.t("SKILL_NAME"),
        step + requestAttributes.t("CONTINUE_ROUTINE_SUFFIX")
      )
      .getResponse();
  }
};

const ContinueRoutineHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      (request.intent.name === "ContinueRoutineIntent" ||
        request.intent.name === "AMAZON.NextIntent" ||
        request.intent.name === "AMAZON.ResumeIntent")
    );
  },
  async handle(handlerInput) {
    const attMan = handlerInput.attributesManager;
    const requestAttributes = attMan.getRequestAttributes();
    // save step number
    const attributes = (await attMan.getPersistentAttributes()) || {};
    const num =
      Object.keys(attributes).indexOf("lastStep") >= 0
        ? attributes.lastStep + 1
        : 1;
    attributes.lastStep = num;
    attMan.setPersistentAttributes(attributes);
    await attMan.savePersistentAttributes();
    // initialize step content
    let step = "";
    // update step content based on current step number; save
    switch (attributes.lastStep) {
      case 1:
        step = requestAttributes.t("ROUTINE_STEP_START");
        break;
      case 2:
        step = requestAttributes.t("ROUTINE_STEP_TWO");
        break;
      case 3:
        step = requestAttributes.t("ROUTINE_STEP_THREE");
        break;
      case 4:
        step = requestAttributes.t("ROUTINE_STEP_FOUR");
        break;
      case 5:
        step = requestAttributes.t("ROUTINE_STEP_FIVE");
        break;
      case 6:
        step = requestAttributes.t("ROUTINE_STEP_SIX");
        break;
      case 7:
        step = requestAttributes.t("ROUTINE_STEP_SEVEN");
        break;
      case 8:
        step = requestAttributes.t("ROUTINE_STEP_EIGHT");
        break;
      case 9:
        step = requestAttributes.t("ROUTINE_STEP_NINE");
        break;
      case 10:
        step = requestAttributes.t("ROUTINE_STEP_END");
        break;
      default:
        step = requestAttributes.t("ROUTINE_STEP_END");
    }
    attributes.lastSpeech = step;
    attMan.setPersistentAttributes(attributes);
    await attMan.savePersistentAttributes();

    let speakOutput = requestAttributes.t("CONTINUE_ROUTINE_PREFIX") + step;
    if (num >= 10) speakOutput += requestAttributes.t("END_ROUTINE_SUFFIX");

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withSimpleCard(requestAttributes.t("SKILL_NAME"), speakOutput)
      .getResponse();
  }
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.HelpIntent"
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t("HELP_MESSAGE"))
      .reprompt(requestAttributes.t("HELP_REPROMPT"))
      .withSimpleCard(
        requestAttributes.t("SKILL_NAME"),
        requestAttributes.t("HELP_MESSAGE")
      )
      .getResponse();
  }
};

const FallbackHandler = {
  // 2018-Aug-01: AMAZON.FallbackIntent is only currently available in en-* locales.
  //              This handler will not be triggered except in those locales, so it can be
  //              safely deployed for any locale.
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.FallbackIntent"
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const speakOutput =
      requestAttributes.t("FALLBACK_MESSAGE") +
      requestAttributes.t("HELP_REPROMPT");
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(requestAttributes.t("FALLBACK_REPROMPT"))
      .withSimpleCard(requestAttributes.t("SKILL_NAME"), speakOutput)
      .getResponse();
  }
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (
      request.type === "IntentRequest" &&
      (request.intent.name === "AMAZON.CancelIntent" ||
        request.intent.name === "AMAZON.StopIntent")
    );
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t("STOP_MESSAGE"))
      .getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "SessionEndedRequest";
  },
  handle(handlerInput) {
    console.log(
      `Session ended with reason: ${
        handlerInput.requestEnvelope.request.reason
      }`
    );
    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);
    console.log(`Error stack: ${error.stack}`);
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(requestAttributes.t("ERROR_MESSAGE"))
      .reprompt(requestAttributes.t("ERROR_MESSAGE"))
      .withSimpleCard(
        requestAttributes.t("SKILL_NAME"),
        requestAttributes.t("ERROR_MESSAGE")
      )
      .getResponse();
  }
};

const getPersistentAttributes = async handlerInput =>
  await handlerInput.attributesManager.getPersistentAttributes();

const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      resources: languageStrings
    });
    localizationClient.localize = function localize() {
      const args = arguments;
      const values = [];
      for (let i = 1; i < args.length; i += 1) {
        values.push(args[i]);
      }
      const value = i18n.t(args[0], {
        returnObjects: true,
        postProcess: "sprintf",
        sprintf: values
      });
      if (Array.isArray(value)) {
        return value[Math.floor(Math.random() * value.length)];
      }
      return value;
    };
    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function translate(...args) {
      return localizationClient.localize(...args);
    };
  }
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = dashbot.handler(
  skillBuilder
    .addRequestHandlers(
      LaunchRequestHandler,
      RepeatHandler,
      GetNewFactHandler,
      StartRoutineHandler,
      ContinueRoutineHandler,
      HelpHandler,
      ExitHandler,
      FallbackHandler,
      SessionEndedRequestHandler
    )
    .addRequestInterceptors(LocalizationInterceptor)
    .addErrorHandlers(ErrorHandler)
    .withTableName("sleepwalker-data")
    .withAutoCreateTable(true)
    .lambda()
);

// TODO: translations

const enData = {
  translation: {
    SKILL_NAME: "Sleep Walker",
    LAUNCH_MESSAGE:
      "Hi! I'm Sleep Walker, and I can help you get ready for bed. ",
    GET_FACT_MESSAGE: "Did you know? ",
    HELP_MESSAGE:
      "You can say 'start my routine' to start a bed time routine. Say 'tell sleep walker to continue' to go on to the next step. You can also say 'repeat that' or 'ask sleep walker for a sleep fact'. What would you like to do?",
    HELP_REPROMPT: "What can I help you with?",
    FALLBACK_MESSAGE:
      "Sleep Walker  can help you follow a bedtime routine, or tell you cool facts about sleep.",
    FALLBACK_REPROMPT: "What can I help you with?",
    ERROR_MESSAGE: "Sorry, an error occurred.",
    STOP_MESSAGE: "Goodbye!",
    FACTS: [
      "I'm asleep most of the time.",
      "It's even more dangerous to sleep while drowsy than to do so while intoxicated.",
      "Sleep deprivation leads to weight gain by upsetting the regulation of hormones that control hunger.",
      "The tendency to sleep walk runs in families.",
      "12 percent of people dream exclusively in black and white.",
      "The record for the longest period a person has gone without sleep is 11 days.",
      "You will spend a third of your life asleep, but your cat will spend 2 thirds of its life sleeping.",
      "Deaf people have been known to use sign language in their sleep.",
      "Birds and aquatic mammals can be asleep in 1 half of their brain while the other half stays alert.",
      "New parents lose an average of 44 days of sleep a year, thanks to their little bundles of joy.",
      "Many animals, including humans, can sleep with their eyes open.",
      "Sleep cleanses your brain of toxins. It's a really, really good idea to get enough sleep. Sorry, am I ranting again?",
      "Everyone has dreams. Most people forget 90 percent of them, and some people forget almost all of them.",
      "The optimum amount of sleep for adults seems to be about 7 hours. People who get significantly more or less sleep than that do not live as long as those who do.",
      "Yawning is contagious. Actually, I feel one coming on right now.",
      "Your first yawn was probably taken before birth, in your mother's womb."
    ],
    NOTHING_TO_REPEAT: "Sorry, there is nothing to repeat.",
    START_ROUTINE_PREFIX: "O.K., here we go. ",
    CONTINUE_ROUTINE_PREFIX: [
      "O.K. ",
      "Alright. ",
      "Great. ",
      "Excellent. ",
      "You're doing great. ",
      "You rock. ",
      "You are crushing this. ",
      "Way to get ready for bed. ",
      "You are unstoppable. ",
      "Awesome. ",
      "Like a boss. "
    ],
    ROUTINE_STEP_START:
      "The very first step is to simply stop working or eating. If you are enjoying a warm, uncaffeinated beverage, that's fine.",
    ROUTINE_STEP_TWO:
      "Step 2. List up to 3 well-defined tasks that you want to accomplish tomorrow. You can use your phone or a piece or paper, or even just make a mental note.",
    ROUTINE_STEP_THREE:
      "Step 3. Put out your clothes for tomorrow. Choose wardrobe pieces that are in harmony with your task list. Confidently envision yourself in those clothes and successfully accomplishing your goals.",
    ROUTINE_STEP_FOUR:
      "Step 4. Dim the lights in your sleeping area and turn off all electronic screens there, then move to the bathroom.",
    ROUTINE_STEP_FIVE: "Step 5. Floss your teeth.",
    ROUTINE_STEP_SIX: "Step 6. Brush your teeth for 2 minutes.",
    ROUTINE_STEP_SEVEN: "Step 7. Do your night time facial routine.",
    ROUTINE_STEP_EIGHT: "Step 8. Swish mouthwash in your mouth for 30 seconds.",
    ROUTINE_STEP_NINE:
      "Step 9. Return to your sleeping area and do a meditation or say a prayer.",
    ROUTINE_STEP_END:
      "This is the last step. You are feeling more relaxed and sleepy, and ready to go to bed. Change into your pajamas. Turn off the lights so it's nice and dark. Get under the covers.",
    CONTINUE_ROUTINE_SUFFIX:
      " Let me know when you're done by saying continue or I'm ready.",
    END_ROUTINE_SUFFIX: " Goodnight. Sleep well."
  }
};

const enauData = {
  translation: {
    SKILL_NAME: "Austrailian Sleep Walker"
  }
};

const encaData = {
  translation: {
    SKILL_NAME: "Canadian Sleep Walker"
  }
};

const engbData = {
  translation: {
    SKILL_NAME: "British Sleep Walker"
  }
};

const eninData = {
  translation: {
    SKILL_NAME: "Indian Sleep Walker"
  }
};

const enusData = {
  translation: {
    SKILL_NAME: "American Sleep Walker"
  }
};

// constructs i18n and l10n data structure
// translations for this sample can be found at the end of this file
const languageStrings = {
  // de: deData,
  // "de-DE": dedeData,
  en: enData,
  "en-AU": enauData,
  "en-CA": encaData,
  "en-GB": engbData,
  "en-IN": eninData,
  "en-US": enusData
  // es: esData,
  // "es-ES": esesData,
  // "es-MX": esmxData,
  // fr: frData,
  // "fr-FR": frfrData,
  // it: itData,
  // "it-IT": ititData,
  // ja: jpData,
  // "ja-JP": jpjpData
};
