import { CronJob } from 'cron';
import { Bot } from 'grammy';
import { EmailBD } from './emails.bd';
import 'dotenv/config'

const bot = new Bot(process.env.BOT_TOKEN!); // <-- put your bot token between the "" (https://t.me/BotFather)
const chatId = -4219687159;
const emailsBD = new EmailBD();

bot.hears(/лео[,]* представься/i, (ctx) => {
  console.log(ctx.chat.id);
  ctx.reply(
    'Привет всем! \n\nМеня зовут Лео, и я ваш новый бот-ассистент. Умею напоминать о сроках сдачи ваших задач каждую неделю и создавать ссылки на Google Meet, когда вам нужно провести собрание. \n\nЭто только начало, и я готов учиться новым вещам, чтобы стать еще полезнее. Если у вас есть идеи или пожелания, как улучшить мои навыки, обязательно поделитесь!\n\nРад начать работу с вами и помогать вам каждый день!'
  );
});
bot.hears(/мила/gi, (ctx) => {
  console.log(ctx.chat.id);
  ctx.reply('ДУРА');
});
bot.hears(/лео как там сережа?/i, (ctx) => {
  console.log(ctx.chat.id);
  ctx.reply('снова спился');
});
bot.hears(/спасибо лео/i, (ctx) => {
  console.log(ctx.chat.id);
  ctx.reply('всегда пожалуйста!');
});

bot.hears(/лео, обьясни как запрашивать доступ к почте/i, (ctx) => {
  console.log(ctx.chat.id);
  ctx.reply('Конечно!\n\n Сначала вам необходимо написать "дай доступ к почте" далее полное название домена \n\n Например: дай доступ к почте marketerpro.digital' );
});
bot.hears(/ударь/i, (ctx) => {
  console.log(ctx.chat.id);
  ctx.replyWithSticker('CAACAgIAAxkBAAMqZmvahFovSs5Pvu3FXTGWZy7tjXoAAjUAA1m7_CWaxXqDGuB4VDUE');
});

bot.hears(/дай email (.+)/i, async (ctx) => {
  const email = await emailsBD.getByEmail(ctx.match[1]);
  if (!email) {
    await ctx.reply('Записей не найдено для emaila ' + ctx.match[1]);
    return;
  }

  ctx.reply('```\n' + JSON.stringify(email) + '```', { parse_mode: 'MarkdownV2' });
});

bot.hears(/дай доступ к почте (.+)/i, async (ctx) => {
  const email = await emailsBD.getByName(ctx.match[1]);
  if (!email) {
    await ctx.reply('Записей не найдено для имени ' + ctx.match[1]);
    return;
  }

  ctx.reply(`Name: ${email.name}
Email: <code>${email.email}</code>
Password: <code>${email.password}</code>
Link: <code>${email.link}</code>`, { parse_mode: 'HTML'})

});
// bot.on('message:sticker', ctx => console.log(ctx.message.sticker))

const job = new CronJob(
  '0 0 11 * * FRI', // cronTime
  function () {
    bot.api.sendMessage(
      chatId,
      'Привет, команда! \n\nСегодня пятница, и я хочу напомнить вам о необходимости отправить свои таблицы с задачами за эту неделю. Это поможет нам всем быть в курсе, что и как продвигается, и планировать наши следующие шаги эффективно.'
    );
  }, // onTick
  null, // onComplete
  true, // start
  'Europe/Istanbul' // timeZone
);

bot.start();
