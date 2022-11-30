import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, Message, SelectMenuBuilder,} from 'discord.js';
import fs from 'fs';

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

    if (users.includes(interaction.user.id)) {
      await interaction.reply({
        content: 'You sneaky little santa!',
        ephemeral: true,
      });
      return;
    }

    const nameText = `**Ho, ho, ho!**
  
Hallo daar **${interaction.user.username}**!  :upside_down:

Ik ben de **kerstman!**:santa_tone2:
Dit jaar help ik onze school terug met het **organiseren van de kerstviering**. :saluting_face:

Omdat iedereen van iedere leeftijd gelukkig wordt van **pakjes**  :gift:,   
Kan jij mij dit jaar helpen om **secret santa** :shushing_face: te zijn :fire:
... Dit bespaart mij ook wat werk :sled:  :sleeping: 

Maar omdat niet iedereen graag verast word is het **opt-in.**

Iedereen die mijn vragen mooi beantwoord komt in de lijst en krijgt **binnenkort nog een berichtje** van mij.
**Met daarin wie jij mag verassen!**

Om te beginnen is het budget **maximaal 5 euro**.
Je mag hier *natuurlijk* over gaan moest dit een goede *vriend/vriendin* zijn!
Maar hou je **budget** wel in de gaten!

Laten we beginnen met de vragen!

\`\`\`Wat is jouw echte naam (voor & achternaam)? Zodat andere studenten u herkennen.\`\`\`
`;
    const ask = async (text: string): Promise<string> => {
      const message = await interaction.user.send(text);
      const filter = (m: Message): boolean =>
        m.author.id === interaction.user.id;

      const reaction = await message.channel.awaitMessages({
        filter,
        max: 1,
        time: 2000000,
        errors: ['time'],
      });

      return reaction.first()?.content ?? 'error';
    };

    const data = {
      userId: interaction.user.id,
      name: 'unknown',
      class: 'unknown',
      classLabel: 'unknown',
      email: 'unknown',
      tip: 'unknown',
    };

    data.name = await ask(nameText);

    const askName = async (): Promise<any> => {
      data.name = await ask(
        `\`\`\`Wat is jouw echte naam (voor & achternaam)? Zodat andere studenten u herkennen.\`\`\``
      );
      await askNameCorrect();
    };
    const askNameCorrect = async (): Promise<any> => {
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
        content: `\`\`\`Hallo "${data.name}"! Heb ik die naam juist? (klick een van de knoppen hier beneden)\`\`\``,
        components: [buttons],
      });

      const collector = nameCorrect.createMessageComponentCollector({
        time: 2000000,
      });

      collector.on('collect', async (i) => {
        if (!i.isButton()) return;
        if (i.user.id !== interaction.user.id) return;

        if (i.customId === 'santanameno') {
          askName();
        }
        if (i.customId === 'santanameyes') {
          askClass();
        }

        await collector.stop();
      });
    };

    await askNameCorrect();

    const askClass = async (): Promise<any> => {
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
        content: `\`\`\`Wat is uw klas? (selecteer het hier beneden)\`\`\``,
        components: [classes],
      });

      const collector = selectedClass.createMessageComponentCollector({
        time: 2000000,
      });

      collector.on('collect', async (i) => {
        if (!i.isSelectMenu()) return;
        if (i.user.id !== interaction.user.id) return;

        console.log(i.values[0]);
        data.class = i.values[0];
        const classesLabels = {
          mpgm1a: 'Mariakerke PGM1a',
          mpgm1b: 'Mariakerke PGM1b',
          opgm1: 'Oudenaarde PGM1',
          pgm2: 'Mariakerke PGM2',
        };
        // @ts-ignore
        data.classLabel = classesLabels[i.values[0]];
        askClassCorrect();

        await collector.stop();
      });
    };

    const askClassCorrect = async (): Promise<any> => {
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
        content: `\`\`\`Dus jij zit in ${data.classLabel} (klick een van de knoppen hier beneden)\`\`\``,
        components: [buttons],
      });

      const collector = nameCorrect.createMessageComponentCollector({
        time: 2000000,
      });

      collector.on('collect', async (i) => {
        if (!i.isButton()) return;
        if (i.user.id !== interaction.user.id) return;

        if (i.customId === 'santanameno') {
          await askClass();
        }
        if (i.customId === 'santanameyes') {
          await askEmail();
        }

        await collector.stop();
      });
    };

    const askEmail = async (): Promise<any> => {
      data.email = await ask(
        `\`\`\`Wat is jouw korte school Email? (ter verificatie)\`\`\``
      );
      askEmailCorrect();
    };

    const askEmailCorrect = async (): Promise<any> => {
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
        content: `\`\`\`Dus jouw email is ${data.email} (klick een van de knoppen hier beneden)\`\`\``,
        components: [buttons],
      });

      const collector = nameCorrect.createMessageComponentCollector({
        time: 2000000,
      });

      collector.on('collect', async (i) => {
        if (!i.isButton()) return;
        if (i.user.id !== interaction.user.id) return;

        if (i.customId === 'santanameno') {
          askEmail();
        }
        if (i.customId === 'santanameyes') {
          askTips();
        }

        await collector.stop();
      });
    };

    const askTips = async (): Promise<any> => {
      data.tip = await ask(
        `\`\`\`We hebben dan nog enkel een cadeau tip / boost nodig voor uw secret santa (die hem/haar kunnen helpen om een cadeau te vinden) (weet je geen, stuur 'veras mij')\`\`\``
      );

      interaction.user.send(
        `Ho, ho, ho!

Dat was veel!
Maar dat was het, je bent ingeschreven voor secret santa, bedankt voor het invullen ${data.name} uit ${data.classLabel}!

We zullen wel nog ${data.email} controleren voordat we de namen gaan trekken.

Ho, ho,
Santa Claus`
      );

      const db = fs.readFileSync('./src/data/santas.json', 'utf8');
      const dbJson = JSON.parse(db);
      console.log(dbJson);

      const newDb = { ...dbJson };
      newDb[data.class].push(data);

      fs.writeFileSync(
        './src/data/santas.json',
        JSON.stringify(newDb, null, 2)
      );
    };
  } catch (e) {
    console.log(e);
  }
}

export default startsantachat;
