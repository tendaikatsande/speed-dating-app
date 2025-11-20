# Contributing to SpeedDate

Thank you for your interest in contributing to SpeedDate! This document provides guidelines and instructions for contributing.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/speed-dating-app.git`
3. Create a feature branch: `git checkout -b feature/amazing-feature`
4. Follow the [SETUP.md](./SETUP.md) guide to set up your development environment

## Development Workflow

### Before You Start

- Check existing issues and PRs to avoid duplicate work
- Open an issue to discuss major changes before implementing
- Ensure you have the latest code: `git pull origin main`

### Code Style

- Use TypeScript for type safety
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

### Component Guidelines

- Place reusable components in `components/ui/`
- Place feature-specific components in their respective directories
- Use server components by default, add `'use client'` only when needed
- Export dynamic routes with `export const dynamic = 'force-dynamic'` for auth pages

### TypeScript Guidelines

- Define types in `lib/types/` for shared types
- Use proper typing, avoid `any` unless absolutely necessary
- Create interfaces for component props
- Update `database.types.ts` when modifying database schema

### Styling

- Use Tailwind CSS for styling
- Follow the existing color scheme (rose/pink theme)
- Ensure responsive design (mobile-first approach)
- Use the `cn()` utility from `lib/utils.ts` for conditional classes

## Testing Your Changes

1. **Run the development server**:
   ```bash
   npm run dev
   ```

2. **Test in browser**:
   - Check all affected pages
   - Test on different screen sizes
   - Verify authentication flows
   - Check console for errors

3. **Build the project**:
   ```bash
   npm run build
   ```

## Database Changes

If you modify the database schema:

1. Update `supabase/schema.sql` with new migrations
2. Update `lib/types/database.types.ts` with new type definitions
3. Test the schema changes in a development Supabase project
4. Document any new RLS policies or triggers
5. Provide migration instructions in your PR

## Submitting Changes

### Commit Messages

Use clear, descriptive commit messages:
- `feat: add user profile edit functionality`
- `fix: resolve authentication redirect issue`
- `docs: update setup instructions`
- `style: improve mobile responsive layout`
- `refactor: simplify event registration logic`

### Pull Request Process

1. Update documentation if needed
2. Test your changes thoroughly
3. Push your branch: `git push origin feature/amazing-feature`
4. Open a Pull Request with:
   - Clear title describing the change
   - Detailed description of what and why
   - Screenshots for UI changes
   - References to related issues

### PR Requirements

- [ ] Code follows the existing style
- [ ] Changes are tested locally
- [ ] Documentation is updated (if applicable)
- [ ] No console errors or warnings
- [ ] Responsive design is maintained
- [ ] TypeScript types are properly defined

## Areas for Contribution

### High Priority

- Profile setup flow after signup
- Event detail pages with registration
- Real-time chat implementation
- Profile edit functionality
- Image upload for avatars and events

### Features

- Email notifications
- Advanced search and filters
- Event recommendations
- User preferences management
- Admin dashboard

### Improvements

- Error handling and loading states
- Form validation
- Accessibility improvements
- Performance optimizations
- Test coverage

### Documentation

- API documentation
- Component documentation
- More setup examples
- Troubleshooting guides

## Code Review Process

1. Maintainers will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged
4. Your contribution will be acknowledged in releases

## Questions?

- Open an issue for bugs or feature requests
- Start a discussion for general questions
- Review existing issues and PRs for similar topics

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what's best for the project

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

---

Thank you for contributing to SpeedDate! 💕
