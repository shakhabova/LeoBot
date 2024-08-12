import { CronJob } from 'cron';
import { Bot } from 'grammy';
import { EmailBD } from './emails.bd';
import 'dotenv/config'

const bot = new Bot(process.env.BOT_TOKEN!); // <-- put your bot token between the "" (https://t.me/BotFather)
const chatId = -1002196491953;
const emailsBD = new EmailBD();

bot.hears(/лео[,]* представься/i, (ctx) => {
  console.log(ctx.chat.id);
  ctx.reply(
    'Привет всем! \n\nМеня зовут Лео, и я ваш новый бот-ассистент. Умею напоминать о сроках сдачи ваших задач каждую неделю, предоставлять доступ к почтам и создавать ссылки на Google Meet, когда вам нужно провести собрание. \n\nЭто только начало, и я готов учиться новым вещам, чтобы стать еще полезнее. Если у вас есть идеи или пожелания, как улучшить мои навыки, обязательно поделитесь!\n\nРад начать работу с вами и помогать вам каждый день!'
  );
});
// bot.hears(/мила/gi, (ctx) => {
//   console.log(ctx.chat.id);
//   ctx.reply('ДУРА');
// });
bot.command('google_meet', (ctx)=>{
 ctx.reply('https://meet.google.com/gww-tviv-wvj')
});

bot.hears(/check_id/i, ctx => {
  console.log(ctx.chat);
})

bot.hears(/спасибо лео/i, (ctx) => {
  console.log(ctx.chat.id);
  ctx.reply('всегда пожалуйста!');
});
bot.hears(/лео спасибо/i, (ctx) => {
  console.log(ctx.chat.id);
  ctx.reply('всегда пожалуйста!');
});

bot.hears(/лео обьясни как запрашивать доступ к почте/i, (ctx) => {
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
  '0 35 15 * * FRI', // cronTime
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

const job2 = new CronJob(
  '0 20 11 * * MON', // cronTime
  function () {
    bot.api.sendMessage(
      chatId,
      'Доброе утро, команда! \n\nНадеюсь, вы хорошо отдохнули и готовы к новым достижениям. Желаю вам сегодня максимальной продуктивности, новых идей и успешного выполнения всех запланированных задач. \n\n Хорошего и эффективного дня всем!'
      );
  }, // onTick
  null, // onComplete
  true, // start
  'Europe/Istanbul' // timeZone
);
// const job3 = new CronJob(
//   '0 0 11 * * TUE', // cronTime
//   function () {
//     bot.api.sendMessage(
//       chatId,
//       'Здравствуйте, коллеги! \n\nНапоминаю, что месяц подходит к концу, и пора подводить итоги. Пожалуйста, не забудьте отправить свои отчеты по таскам, которые были выполнены в течение месяца. Это поможет нам оценить наши достижения и определить приоритеты на предстоящий месяц.');
//   }, // onTick
//   null, // onComplete
//   true, // start
//   'Europe/Istanbul' // timeZone
// );
// const job2 = new CronJob(
//   '0 46 9 * * WED', // cronTime
//   function () {
//     bot.api.sendMessage(
//       chatId,
//       'Привет, команда! \n\n Напоминаю, что сегодня в 10:00 по времени Стамбула у вас запланирован звонок с Фатимой. Чтобы получить ссылку на Google Meet, пожалуйста, введите команду ниже. \n\n Желаю всем продуктивного и успешного дня! '
//     );
//   }, // onTick
//   null, // onComplete
//   true, // start
//   'Europe/Istanbul' // timeZone
// );

bot.start();
