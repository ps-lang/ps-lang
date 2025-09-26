# PS-LANG Documentation Site

Official documentation website for PS-LANG (Privacy-First Agent Command Language).

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## 📁 Project Structure

```
ps-lang.dev/
├── app/
│   ├── page.tsx          # Landing page
│   ├── docs/            # Documentation pages
│   ├── examples/        # PS-LANG examples
│   ├── playground/      # Interactive playground
│   ├── get-started/     # Getting started guide
│   └── about/           # About PS-LANG
├── components/          # Reusable UI components
└── lib/                # Utility functions
```

## 🎨 Features

- **Interactive Playground**: Test PS-LANG syntax in real-time
- **Documentation**: Comprehensive guides and API reference
- **Examples**: Real-world use cases and code samples
- **Privacy Zones Visualizer**: See how privacy zones work
- **Command Reference**: All PS-LANG commands explained

## 🔐 PS-LANG Core Concepts

### Privacy Zones
- `<.` Agent-Blind - Invisible to AI agents
- `<#.` Read-Only - AI can read but not modify
- `<@.` Interactive - Full AI interaction
- `<~.` Agent-Managed - AI autonomous control

### Commands
- `.login` - Start session
- `.journal` - Daily journaling
- `.blog` - Generate blog posts
- `.commit` - Git commits with privacy

## 🛠️ Development

This site is built with:
- **Next.js 14** - React framework
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library
- **TypeScript** - Type safety

## 📝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit changes with PS-LANG markers
4. Push to your branch
5. Open a Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 🔗 Links

- [PS-LANG GitHub](https://github.com/Vummo/ps-lang)
- [PS-LANG Specification](https://github.com/Vummo/ps-lang/blob/main/README.md)
- [Documentation](https://ps-lang.dev)

---

**PS-LANG**: Take control of what you say to AI