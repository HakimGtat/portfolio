export type TagCategory = 'language' | 'hardware' | 'networking' | 'tools';

const categories: Record<TagCategory, string[]> = {
  language: ['C', 'C++', 'Python', 'TypeScript', 'JavaScript', 'SQL', 'Java', 'SystemVerilog'],
  hardware: [
    'MSP432', 'Raspberry Pi', 'FPGA', 'Time-of-Flight', 'SRAM', 'VGA', 'UART', 'PWM', 'FSM',
    'x86', 'Coral Edge TPU',
  ],
  networking: ['TCP/UDP', 'IPv4/IPv6', 'Sockets', 'HTTP'],
  tools: [
    'Linux', 'Git', 'Astro', 'React', 'Flask', 'MacSim', 'Matplotlib', 'TensorFlow Lite',
    'Claude API', 'Cloudflare', 'Shiki',
  ],
};

const lookup = new Map<string, TagCategory>(
  (Object.entries(categories) as [TagCategory, string[]][]).flatMap(([cat, tags]) =>
    tags.map((t) => [t.toLowerCase(), cat] as const),
  ),
);

export function tagCategory(tag: string): TagCategory {
  return lookup.get(tag.toLowerCase()) ?? 'tools';
}
