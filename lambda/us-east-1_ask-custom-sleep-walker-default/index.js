// Alexa Fact Skill - Sample for Beginners
/* eslint no-use-before-define: 0 */
// sets up dependencies
const Alexa = require("ask-sdk");
const i18n = require("i18next");
const sprintf = require("i18next-sprintf-postprocessor");

// core functionality for fact skill

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    return handlerInput.responseBuilder
      .speak(
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
    // concatenates a standard message with the random fact
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

    return handlerInput.responseBuilder
      .speak(requestAttributes.t("CONTINUE_ROUTINE_PREFIX") + step)
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
    return handlerInput.responseBuilder
      .speak(requestAttributes.t("FALLBACK_MESSAGE"))
      .reprompt(requestAttributes.t("FALLBACK_REPROMPT"))
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
        if (value[0] === "routine") {
          return value[1];
        }
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

exports.handler = skillBuilder
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
  .lambda();

// translations
// const deData = {
//   translation: {
//     SKILL_NAME: 'Weltraumwissen',
//     GET_FACT_MESSAGE: 'Hier sind deine Fakten: ',
//     HELP_MESSAGE: 'Du kannst sagen, „Nenne mir einen Fakt über den Weltraum“, oder du kannst „Beenden“ sagen... Wie kann ich dir helfen?',
//     HELP_REPROMPT: 'Wie kann ich dir helfen?',
//     FALLBACK_MESSAGE: 'Die Weltraumfakten Skill kann dir dabei nicht helfen. Sie kann dir Fakten über den Raum erzählen, wenn du dannach fragst.',
//     FALLBACK_REPROMPT: 'Wie kann ich dir helfen?',
//     ERROR_MESSAGE: 'Es ist ein Fehler aufgetreten.',
//     STOP_MESSAGE: 'Auf Wiedersehen!',
//     FACTS:
//       [
//         'Ein Jahr dauert auf dem Merkur nur 88 Tage.',
//         'Die Venus ist zwar weiter von der Sonne entfernt, hat aber höhere Temperaturen als Merkur.',
//         'Venus dreht sich entgegen dem Uhrzeigersinn, möglicherweise aufgrund eines früheren Zusammenstoßes mit einem Asteroiden.',
//         'Auf dem Mars erscheint die Sonne nur halb so groß wie auf der Erde.',
//         'Jupiter hat den kürzesten Tag aller Planeten.',
//       ],
//   },
// };
//
// const dedeData = {
//   translation: {
//     SKILL_NAME: 'Weltraumwissen auf Deutsch',
//   },
// };

const enData = {
  translation: {
    SKILL_NAME: "Sleep Walker",
    LAUNCH_MESSAGE:
      "Hi! I'm Sleep Walker, and I can help you get ready for bed. ",
    GET_FACT_MESSAGE: "Did you know? ",
    HELP_MESSAGE:
      "You can say help me get ready for bed, or, tell me a sleep fact. To exit you can say exit... What can I help you with?",
    HELP_REPROMPT: "What can I help you with?",
    FALLBACK_MESSAGE:
      "Sleep Walker can't help you with that.  It can help you follow a bedtime routine, or tell you cool facts about sleep. What can I help you with?",
    FALLBACK_REPROMPT: "What can I help you with?",
    ERROR_MESSAGE: "Sorry, an error occurred.",
    STOP_MESSAGE: "Goodbye!",
    FACTS: ["I'm asleep most of the time"],
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
      "The very first step is to simply stop working or eating. If you are enjoying a warm beverage, that's fine.",
    ROUTINE_STEP_TWO: "Step 2.",
    ROUTINE_STEP_THREE: "Step 3.",
    ROUTINE_STEP_FOUR: "Step 4.",
    ROUTINE_STEP_FIVE: "Step 5.",
    ROUTINE_STEP_SIX: "Step 6.",
    ROUTINE_STEP_SEVEN: "Step 7.",
    ROUTINE_STEP_EIGHT: "Step 8.",
    ROUTINE_STEP_NINE: "Step 9.",
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

// const esData = {
//   translation: {
//     SKILL_NAME: "Curiosidades del Espacio",
//     GET_FACT_MESSAGE: "Aquí está tu curiosidad: ",
//     HELP_MESSAGE:
//       "Puedes decir dime una curiosidad del espacio o puedes decir salir... Cómo te puedo ayudar?",
//     HELP_REPROMPT: "Como te puedo ayudar?",
//     FALLBACK_MESSAGE:
//       "La skill Curiosidades del Espacio no te puede ayudar con eso.  Te puede ayudar a descubrir curiosidades sobre el espacio si dices dime una curiosidad del espacio. Como te puedo ayudar?",
//     FALLBACK_REPROMPT: "Como te puedo ayudar?",
//     ERROR_MESSAGE: "Lo sentimos, se ha producido un error.",
//     STOP_MESSAGE: "Adiós!",
//     FACTS: [
//       "Un año en Mercurio es de solo 88 días",
//       "A pesar de estar más lejos del Sol, Venus tiene temperaturas más altas que Mercurio",
//       "En Marte el sol se ve la mitad de grande que en la Tierra",
//       "Jupiter tiene el día más corto de todos los planetas",
//       "El sol es una esféra casi perfecta"
//     ]
//   }
// };
//
// const esesData = {
//   translation: {
//     SKILL_NAME: "Curiosidades del Espacio para España"
//   }
// };
//
// const esmxData = {
//   translation: {
//     SKILL_NAME: "Curiosidades del Espacio para México"
//   }
// };
//
// const frData = {
//   translation: {
//     SKILL_NAME: "Anecdotes de l'Espace",
//     GET_FACT_MESSAGE: "Voici votre anecdote : ",
//     HELP_MESSAGE:
//       "Vous pouvez dire donne-moi une anecdote, ou, vous pouvez dire stop... Comment puis-je vous aider?",
//     HELP_REPROMPT: "Comment puis-je vous aider?",
//     FALLBACK_MESSAGE:
//       "La skill des anecdotes de l'espace ne peux vous aider avec cela. Je peux vous aider à découvrir des anecdotes sur l'espace si vous dites par exemple, donne-moi une anecdote. Comment puis-je vous aider?",
//     FALLBACK_REPROMPT: "Comment puis-je vous aider?",
//     ERROR_MESSAGE: "Désolé, une erreur est survenue.",
//     STOP_MESSAGE: "Au revoir!",
//     FACTS: [
//       "Une année sur Mercure ne dure que 88 jours.",
//       "En dépit de son éloignement du Soleil, Vénus connaît des températures plus élevées que sur Mercure.",
//       "Sur Mars, le Soleil apparaît environ deux fois plus petit que sur Terre.",
//       "De toutes les planètes, Jupiter a le jour le plus court.",
//       "Le Soleil est une sphère presque parfaite."
//     ]
//   }
// };
//
// const frfrData = {
//   translation: {
//     SKILL_NAME: "Anecdotes françaises de l'espace"
//   }
// };
//
// const itData = {
//   translation: {
//     SKILL_NAME: "Aneddoti dallo spazio",
//     GET_FACT_MESSAGE: "Ecco il tuo aneddoto: ",
//     HELP_MESSAGE:
//       'Puoi chiedermi un aneddoto dallo spazio o puoi chiudermi dicendo "esci"... Come posso aiutarti?',
//     HELP_REPROMPT: "Come posso aiutarti?",
//     FALLBACK_MESSAGE:
//       "Non posso aiutarti con questo. Posso aiutarti a scoprire fatti e aneddoti sullo spazio, basta che mi chiedi di dirti un aneddoto. Come posso aiutarti?",
//     FALLBACK_REPROMPT: "Come posso aiutarti?",
//     ERROR_MESSAGE: "Spiacenti, si è verificato un errore.",
//     STOP_MESSAGE: "A presto!",
//     FACTS: [
//       "Sul pianeta Mercurio, un anno dura solamente 88 giorni.",
//       "Pur essendo più lontana dal Sole, Venere ha temperature più alte di Mercurio.",
//       "Su Marte il sole appare grande la metà che su la terra. ",
//       "Tra tutti i pianeti del sistema solare, la giornata più corta è su Giove.",
//       "Il Sole è quasi una sfera perfetta."
//     ]
//   }
// };
//
// const ititData = {
//   translation: {
//     SKILL_NAME: "Aneddoti dallo spazio"
//   }
// };
//
// const jpData = {
//   translation: {
//     SKILL_NAME: "日本語版豆知識",
//     GET_FACT_MESSAGE: "知ってましたか？",
//     HELP_MESSAGE:
//       "豆知識を聞きたい時は「豆知識」と、終わりたい時は「おしまい」と言ってください。どうしますか？",
//     HELP_REPROMPT: "どうしますか？",
//     ERROR_MESSAGE: "申し訳ありませんが、エラーが発生しました",
//     STOP_MESSAGE: "さようなら",
//     FACTS: [
//       "水星の一年はたった88日です。",
//       "金星は水星と比べて太陽より遠くにありますが、気温は水星よりも高いです。",
//       "金星は反時計回りに自転しています。過去に起こった隕石の衝突が原因と言われています。",
//       "火星上から見ると、太陽の大きさは地球から見た場合の約半分に見えます。",
//       '木星の<sub alias="いちにち">1日</sub>は全惑星の中で一番短いです。',
//       "天の川銀河は約50億年後にアンドロメダ星雲と衝突します。"
//     ]
//   }
// };
//
// const jpjpData = {
//   translation: {
//     SKILL_NAME: "日本語版豆知識"
//   }
// };

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
