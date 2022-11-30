type Primitive = string | number | boolean | null | undefined;

interface String extends String {
  render: (values: Record<string, Primitive>) => string;
  insert: (values: Record<string, Primitive>) => string;
}

interface Date extends Date {
  getWeek: () => number;
  getWeekYear: () => number;
}

type GuildId = string;
type UserId = string;
type ChannelId = string;
