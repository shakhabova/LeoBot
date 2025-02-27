import { CronJob } from 'cron';
import { Bot } from 'grammy';
import { EmailBD } from './emails.bd';
import 'dotenv/config'
import { AdminPanelsBD } from './admin_panels.bd';

const bot = new Bot(process.env.BOT_TOKEN!); // <-- put your bot token between the "" (https://t.me/BotFather)
const chatId = -1002196491953;
const emailsBD = new EmailBD();
const adminPanelBD = new AdminPanelsBD();

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

bot.command('personal_link', (ctx)=>{
  ctx.reply('https://meet.google.com/vam-nham-zcj')
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


bot.hears(/лео подними боевой дух/i, (ctx) => {
  console.log(ctx.chat.id);
  ctx.reply('Команда, боевой дух успешно поднят до космических высот!\n\n Теперь все готовы покорить галактики… или хотя бы доделать таски до конца дня. 🚀😏');
})

bot.hears(/лео кто ты по нации?/i, (ctx) => {
  console.log(ctx.chat.id);
  ctx.reply('Well, I`m british, and you? 🤠');
})

bot.hears(/дай email (.+)/i, async (ctx) => {
  const email = await emailsBD.getByEmail(ctx.match[1]);
  if (!email) {
    await ctx.reply('Записей не найдено для emaila ' + ctx.match[1]);
    return;
  }

  ctx.reply('```\n' + JSON.stringify(email) + '```', { parse_mode: 'MarkdownV2' });
});

bot.hears(/дай доступ к почте (.+)/i, async (ctx) => {
  if(ctx.chat.id !== chatId){
   await ctx.reply('У вас нет доступа к данной функции');
   return
  }
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
bot.hears(/дай доступ к админке (.+)/i, async (ctx) => {
  if(ctx.chat.id !== chatId){
   await ctx.reply('У вас нет доступа к данной функции');
   return
  }
  const admins = await adminPanelBD.getByName(ctx.match[1]);
  if (!admins) {
    await ctx.reply('Записей не найдено для имени ' + ctx.match[1]);
    return;
  }

  ctx.reply(`Name: ${admins.name}
Login: <code>${admins.login}</code>
Password: <code>${admins.password}</code>
Link: <code>${admins.link}</code>`, { parse_mode: 'HTML'})

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
  '0 00 11 * * MON', // cronTime
  function () {
    bot.api.sendMessage(
      chatId,
      'Hi, team! \n\n A new week means new opportunities. I hope the weekend has filled you with energy and positivity. Wishing you all energy, inspiration, and a productive day at work. \n\n Have a great day and good luck with your tasks!⚡️'
      );
  }, // onTick
  null, // onComplete
  true, // start
  'Europe/Istanbul' // timeZone
);

const job5 = new CronJob(
  '00 09 16 01 *', // cronTime
  function () {
    bot.api.sendMessage(
      chatId,
      'Colleagues, today we have a wonderful reason to celebrate — it’s our amazing colleague Aytaj’s birthday! 🎉 Let’s wish her great success at work, ease in solving tasks, and joy from every new achievement! 💻🌟\n\n May each day be filled with inspiration, warmth, and the support of those around her! We wish her good health , happiness , and the fulfillment of all her dreams . May all projects go smoothly, and life bring only positive surprises 🌟✨.Happy Birthday, Aytaj! 🎂🎊'
    );
  }, // onTick
  null, // onComplete
  true, // start
  'Europe/Istanbul' // timeZone
);


const job4 = new CronJob(
  '00 09 07 11 *', // cronTime
  function () {
    bot.api.sendMessage(
      chatId,
      'Colleagues, today we have a great reason to celebrate — it’s Fuad`s birthday! 🎉 \n\n Let’s wish him fewer bugs, successful tests, and only positive results in every project! May each workday bring fresh insights and satisfaction, and may life outside of work be filled with exciting travels, inspiration, and new horizons. Here’s to happiness, health, and the fulfillment of his boldest dreams, both in his career and personal adventures! 🎂✈️'
    );
  }, // onTick
  null, // onComplete
  true, // start
  'Europe/Istanbul' // timeZone
);

const birthdayCrone2 = new CronJob(
  '35 10 10 10 *', // cronTime
  function () {
    bot.api.sendMessage(
      chatId,
      'Colleagues, today we have a great reason to celebrate — it`s Sulyman`s birthday! 🎉 \n\n Let`s wish him bright ideas, inspiration, and only positive emotions at work and in life! May every project be successful, and every day be filled with joy and excitement. Wishing you health, happiness, and the fulfillment of all your wishes! 🎂🎁'
    );
  }, // onTick
  null, // onComplete
  true, // start
  'Europe/Istanbul' // timeZone
);

const birthdayCrone3 = new CronJob(
  '35 10 12 10 *', // cronTime
  function () {
    bot.api.sendMessage(
      chatId,
      'Colleagues, today is a special day — it’s Fatima’s birthday! 🎉 \n\n Let’s congratulate her on this wonderful day and express our gratitude for the professionalism, support, and ability to lead our team to success. We wish you good health, endless energy, new victories, and only pleasant moments on the path to great achievements! May each day be filled with joy, and may all your endeavors lead to success. Thank you for your wisdom and motivation, which make us better! 🎂🎉'
    );
  }, // onTick
  null, // onComplete
  true, // start
  'Europe/Istanbul' // timeZone
);

const bd_Ruslan = new CronJob(
  '10 10 27 02 *', // cronTime
  function () {
    bot.api.sendMessage(
      chatId,
      'Colleagues, today is Ruslan`s birthday! 🎉🎂 \n\n  Let’s all congratulate him and wish him less routine with invoices 📑, quick and smooth website updates 💻, and only successful projects! 🚀 And as a true quiz fan 🧠🎯, we wish him to always have the right answers, easily solve the trickiest puzzles, and collect a whole series of victories! 🏆 May each day bring new discoveries, fun moments, and amazing experiences! \n\n Wishing you happiness, health, and only positive vibes! 🥳🎊'
    );
  }, // onTick
  null, // onComplete
  true, // start
  'Europe/Istanbul' // timeZone
);
// const birthdayCrone = new CronJob(
//   '40 14 2 10 3', // cronTime
//   function () {
//     bot.api.sendMessage(
//       chatId,
//       'test message'
//     );
//   }, // onTick
//   null, // onComplete
//   true, // start
//   'Europe/Istanbul' // timeZone
// );
// const job2 = new CronJob(
//   '0 20 11 * * MON', // cronTime
//   function () {
//     bot.api.sendMessage(
//       chatId,
//       'Доброе утро, команда! \n\nНадеюсь, вы хорошо отдохнули и готовы к новым достижениям. Желаю вам сегодня максимальной продуктивности, новых идей и успешного выполнения всех запланированных задач. \n\n Хорошего и эффективного дня всем!'
//       );
//   }, // onTick
//   null, // onComplete
//   true, // start
//   'Europe/Istanbul' // timeZone
// );

bot.command('survey', (msg) => {
  bot.api.sendPoll(
      chatId,
      'How does your workweek start?', // Вопрос опроса
      [{text:'Conquering mountains!'}, {text:'Everything’s on track'}, {text:'A bit chaotic'}, {text:'Is it Friday yet?'}],   // Варианты ответов
      {
          is_anonymous: true, // Делать ли опрос анонимным
          allows_multiple_answers: false, // Разрешать ли выбирать несколько ответов
      }
  );
});
bot.command('survey2', (msg) => {
  bot.api.sendPoll(
      chatId,
      'Кто хочет поныть?', // Вопрос опроса
      [{text:'🥺 – Я! Я первый в очереди!'}, {text:'😌 – Всё отлично, но могу поныть за компанию.'}, {text:'💪 – Ещё держусь, но на грани.'}, {text:'😎 – Какой ныть?! Я супергерой. '}],   // Варианты ответов
      {
          is_anonymous: true, // Делать ли опрос анонимным
          allows_multiple_answers: false, // Разрешать ли выбирать несколько ответов
      }
  );
});

bot.api.setMyCommands([
  {command: 'survey', description: 'weekly survey'},
  {command: 'survey2', description: 'whine check'},
  {command: 'google_meet', description: 'Создать линк на google meet'},
  {command: 'personal_link', description: 'Fatima`s link'}
])

// const job3 = new CronJob(
//   '0 0 12 * * MON', // cronTime
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
