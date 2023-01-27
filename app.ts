import TelegramBot, { ChatId } from "node-telegram-bot-api";
import { againOptions, gameOptions } from "./options";

const token = "5775137613:AAFRbJ-FBbio-ZCd_6wz5hFcHUjTyd26Muo";

const bot = new TelegramBot(token, { polling: true });

const chats: Record<string, number> = {};

const start = (): void => {
  bot.setMyCommands([
    { command: "/start", description: "Начальное приветствие" },
    { command: "/info", description: "Получение информации" },
    { command: "/game", description: "Начать игру" },
  ]);

  const startGame = async (chatId: ChatId) => {
    await bot.sendMessage(
      chatId,
      "Сейчас я загадаю цифру от 0 до 9, а ты попробуешь ее отгадать"
    );
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Отгадывай", gameOptions);
  };

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;
    if (text === "/start") {
      return bot.sendMessage(chatId, `Добро пожаловать, странник`);
    }
    if (text === "/info") {
      return bot.sendMessage(chatId, `Тебя зовут ${msg.chat.first_name}`);
    }
    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, "Я тебя не понимаю, давай еще раз!");
  });

  bot.on("callback_query", (msg) => {
    const data = msg.data;
    const chatId = msg.message!.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (parseInt(data as string) === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Ты выбрал цифру ${data} и угадал!`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Ты не угадал, бот загадал ${chats[chatId]}!`,
        againOptions
      );
    }
  });
};

start();
