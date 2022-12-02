import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonInteraction,
  ButtonStyle,
  Message,
  SelectMenuBuilder,
} from 'discord.js';
import fs from 'fs';

const messages = {
  dmSent: `*De Kerstman heeft je normaal gezien een privéberichtje gestuurd.*
**Mocht dat niet gebeurd zijn**: controleer even of je privéberichten toe laat van deze server.`,
  dmFailed: `You sneaky little santa!
Je mag je niet meerdere keren aanmelden!

Klopt er iets niet? Neem dan contact op met Kilian / Stualyttle`,
  intro: `**Ho, Ho, Ho! **  :santa_tone2:

Hallo daar {{username}}!  :upside_down:

Ik ben de kerstman! :santa_tone2:

En dit jaar help jij mij met het organiseren van de kerstviering. :saluting_face:

Omdat iedereen altijd gelukkig wordt van **pakjes** :gift:,
Kan jij mij dit jaar helpen om **secret santa** :shushing_face: te zijn :disguised_face:
... Dit bespaart mij ook wat werk :sled:  :ok_hand_tone1: 

Ben je niet overtuigd?
Geen zorgen, het is geen verplichting :thumbsup_tone2:

Denk je:
" Wow! Fantastisch! De Max! Ik doe mee! " ?
**TOP !** Dan heb ik een aantal vragen voor jou :relieved:

:question::pencil:
Iedereen die mijn vragen mooi beantwoord komt in **dé lijst** en krijgt binnenkort nog **een berichtje** van mij. :envelope_with_arrow:
Daarin zal de naam staan met wie **jij mag verrassen!** :partying_face:


:euro:
Om te beginnen is het budget maximaal 5 euro.
Je mag hier natuurlijk over gaan moest dit een goede vriend/vriendin zijn!
Maar hou je budget wel in de gaten! :grimacing:

Laten we beginnen met de vragen! :technologist_tone2:

\`\`\`Wat is jouw naam? [voor & achternaam]\`\`\`
**Informatie**: *Deze naam geven we aan jouw secret santa, en help je hem/haar je te herkennen.*
**Verwachte Actie**: *Typ jouw naam in het chatvenster en verstuur dat in deze chat.*`,
  name: `\`\`\`Wat is jouw naam? [voor & achternaam]\`\`\`
**Informatie**: *Deze naam geven we aan jouw secret santa, en help je hem/haar je te herkennen.*
**Verwachte Actie**: *Typ jouw naam in het chatvenster en verstuur dat in deze chat.*`,
  nameOk: `\`\`\`Hallo daar "{{name}}"! Heb ik dat juist opgenomen?\`\`\`
**Verwachte Actie**: *Druk op Ja of Nee*`,
  class: `\`\`\`Wat is jouw klas?\`\`\`
**Verwachte Actie**: *Open het selecteer venster en kies jouw klas.*`,
  classOk: `\`\`\`Dus jij zit in "{{classLabel}}"\`\`\`
**Verwachte Actie**: *Druk op Ja of Nee*`,
  email: `\`\`\`Wat is jouw korte school Email?\`\`\`
**Bijvoorbeeld**: *santcla@student.arteveldehs.be*
**Verwachte Actie**: *Typ jouw korte email in het chatvenster en verstuur dat in deze chat.*`,
  emailOk: `\`\`\`Dus jouw email is "{{email}}"\`\`\`
**Verwachte Actie**: *Druk op Ja of Nee*`,
  emailNok: `Sorry maar dat is geen school email van ons.

1. Onze school emails zijn altijd @student.arteveldehs.be
2. Wij hebben de korte versie nodig.`,
  tip: `\`\`\`Welke tip zou jij jouw secret santa geven bij het zoeken naar een cadeautje?\`\`\`
**Informatie**: *Weet je geen, stuur 'verras mij'*
**Verwachte Actie**: *Typ jouw naam in het chatvenster en verstuur dat in deze chat.*`,
  outro: `**Ho, Ho, Ho! **  :santa_tone2:

Je bent ingeschreven voor _secret santa_, 
bedankt voor het invullen **{{name}}** uit "{{classLabel}}"! :100: 
Alles is opgeslagen in mijn groot boek! :pencil:

We zullen wel nog "{{email}}" controleren voordat we de namen gaan trekken :nerd:

Tot binnenkort :wave_tone2:
Santa Claus 
:sled::sled::sled::sled::sled:`,
};

const messagesInChat: { [key: string]: Message } = {};

// Command function, name has to be the same as the command name without right naming scheme!
async function startsantachat(interaction: ButtonInteraction): Promise<void> {
  try {
    const oldDb = fs.readFileSync('./src/data/santas.json', 'utf8');
    const oldDbJson = JSON.parse(oldDb);
    const users = [
      ...oldDbJson.mpgm1a.map((a: { userId: string }) => a.userId),
      ...oldDbJson.mpgm1b.map((a: { userId: string }) => a.userId),
      ...oldDbJson.opgm1.map((a: { userId: string }) => a.userId),
      ...oldDbJson.pgm2.map((a: { userId: string }) => a.userId),
    ];

    const illegalAction = users.includes(interaction.user.id);
    await interaction.reply({
      content: illegalAction ? messages.dmFailed : messages.dmSent,
      ephemeral: true,
    });

    if (illegalAction) return;

    const lastMsg = messagesInChat[interaction.user.id];
    if (lastMsg) {
      await lastMsg.delete();
    }

    const ask = async (text: string): Promise<string> => {
      try {
        const message = await interaction.user.send(text);
        messagesInChat[interaction.user.id] = message;
        const filter = (m: Message): boolean =>
          m.author.id === interaction.user.id;

        const reaction = await message.channel.awaitMessages({
          filter,
          max: 1,
          time: 2000000,
          errors: ['time'],
        });

        const newLastMsg = messagesInChat[interaction.user.id];
        if (newLastMsg.id !== message.id)
          throw new Error('Not the last message');

        return reaction.first()?.content ?? 'error';
      } catch (e) {
        return;
      }
    };

    const data = {
      userId: interaction.user.id,
      name: 'unknown',
      class: 'unknown',
      classLabel: 'unknown',
      email: 'unknown',
      tip: 'unknown',
    };

    data.name = await ask(
      messages.intro.replace('{{username}}', interaction.user.username)
    );

    const askName = async (): Promise<any> => {
      try {
        data.name = await ask(messages.name);
        await askNameCorrect();
      } catch (e) {
        return;
      }
    };
    const askNameCorrect = async (): Promise<any> => {
      try {
        const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('santanameyes')
            .setLabel('Ja')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('santanameno')
            .setLabel('Nee')
            .setStyle(ButtonStyle.Danger)
        );

        const nameCorrect = await interaction.user.send({
          content: messages.nameOk.replace('{{name}}', data.name),
          components: [buttons],
        });

        const collector = nameCorrect.createMessageComponentCollector({
          time: 2000000,
        });

        collector.on('collect', async (i) => {
          try {
            if (!i.isButton()) return;
            if (i.user.id !== interaction.user.id) return;

            if (i.customId === 'santanameno') {
              await askName();
            }
            if (i.customId === 'santanameyes') {
              await askClass();
            }

            await collector.stop();
          } catch (e) {
            return;
          }
        });
      } catch (e) {
        return;
      }
    };

    await askNameCorrect();

    const askClass = async (): Promise<any> => {
      try {
        const classes = new ActionRowBuilder<SelectMenuBuilder>().addComponents(
          new SelectMenuBuilder()
            .setCustomId('classes')
            .setPlaceholder('Select your class')
            .addOptions(
              {
                label: 'Mariakerke PGM1a',
                value: 'mpgm1a',
              },
              {
                label: 'Mariakerke PGM1b',
                value: 'mpgm1b',
              },
              {
                label: 'Oudenaarde PGM1',
                value: 'opgm1',
              },
              {
                label: 'Mariakerke PGM2',
                value: 'pgm2',
              }
            )
        );

        const selectedClass = await interaction.user.send({
          content: messages.class,
          components: [classes],
        });

        const collector = selectedClass.createMessageComponentCollector({
          time: 2000000,
        });

        collector.on('collect', async (i) => {
          try {
            if (!i.isSelectMenu()) return;
            if (i.user.id !== interaction.user.id) return;

            data.class = i.values[0];
            const classesLabels = {
              mpgm1a: 'Mariakerke PGM1a',
              mpgm1b: 'Mariakerke PGM1b',
              opgm1: 'Oudenaarde PGM1',
              pgm2: 'Mariakerke PGM2',
            };
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            data.classLabel = classesLabels[i.values[0]];
            await askClassCorrect();

            await collector.stop();
          } catch (e) {
            return;
          }
        });
      } catch (e) {
        return;
      }
    };

    const askClassCorrect = async (): Promise<any> => {
      try {
        const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('santanameyes')
            .setLabel('Ja')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('santanameno')
            .setLabel('Nee')
            .setStyle(ButtonStyle.Danger)
        );

        const nameCorrect = await interaction.user.send({
          content: messages.classOk.replace('{{classLabel}}', data.classLabel),
          components: [buttons],
        });

        const collector = nameCorrect.createMessageComponentCollector({
          time: 2000000,
        });

        collector.on('collect', async (i) => {
          try {
            if (!i.isButton()) return;
            if (i.user.id !== interaction.user.id) return;

            if (i.customId === 'santanameno') {
              await askClass();
            }
            if (i.customId === 'santanameyes') {
              await askEmail();
            }

            await collector.stop();
          } catch (e) {
            return;
          }
        });
      } catch (e) {
        return;
      }
    };

    const askEmail = async (): Promise<any> => {
      try {
        const _email = await ask(messages.email);

        const email = _email
          // Remove caps
          .toLowerCase()
          // Remove spaces
          .split(' ')
          .join('')
          // Remove enters/breaks
          .split('\n')
          .join('');

        if (
          email.split('@').length !== 2 ||
          email.split('@')[0].includes('.') ||
          !email.includes('@student.arteveldehs.be')
        ) {
          await interaction.user.send(messages.emailNok);
          await askEmail();
          return;
        }

        data.email = email.toLowerCase();

        await askEmailCorrect();
      } catch (e) {
        return;
      }
    };

    const askEmailCorrect = async (): Promise<any> => {
      try {
        const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId('santanameyes')
            .setLabel('Ja')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('santanameno')
            .setLabel('Nee')
            .setStyle(ButtonStyle.Danger)
        );

        const nameCorrect = await interaction.user.send({
          content: messages.emailOk.replace('{{email}}', data.email),
          components: [buttons],
        });

        const collector = nameCorrect.createMessageComponentCollector({
          time: 2000000,
        });

        collector.on('collect', async (i) => {
          try {
            if (!i.isButton()) return;
            if (i.user.id !== interaction.user.id) return;

            if (i.customId === 'santanameno') {
              await askEmail();
            }
            if (i.customId === 'santanameyes') {
              await askTips();
            }

            await collector.stop();
          } catch (e) {
            return;
          }
        });
      } catch (e) {
        return;
      }
    };

    const askTips = async (): Promise<any> => {
      try {
        data.tip = await ask(messages.tip);

        await interaction.user.send(
          messages.outro
            .replace('{{name}}', data.name)
            .replace('{{classLabel}}', data.classLabel)
            .replace('{{email}}', data.email)
        );

        const db = fs.readFileSync('./src/data/santas.json', 'utf8');
        const dbJson = JSON.parse(db);

        const newDb = { ...dbJson };
        newDb[data.class].push(data);

        fs.writeFileSync(
          './src/data/santas.json',
          JSON.stringify(newDb, null, 2)
        );
      } catch (e) {
        return;
      }
    };
  } catch (e) {
    return;
  }
}

export default startsantachat;
