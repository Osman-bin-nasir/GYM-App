# React Native Tailwind Boilerplate

This is a starter project for a React Native application built with Expo. It's configured with Tailwind CSS for styling, providing a solid foundation for building a cross-platform mobile app.

## Features

- **Expo Router:** File-based routing for a web-like navigation experience.
- **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
- **NativeWind:** Use Tailwind CSS directly in your React Native components.
- **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.

## Get started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npx expo start
   ```

This will open the Expo developer tools in your browser. You can then run the app on:

- an Android emulator
- an iOS simulator
- Expo Go on your physical device

## Project Structure

- `app/`: This directory contains all the screens and routes for your application.
- `assets/`: Static assets like fonts and images are stored here.
- `tailwind.config.js`: Configuration file for Tailwind CSS.
- `app/globals.css`: Global stylesheet for your application.

## Styling

This project uses [NativeWind](https://www.nativewind.dev/) to enable the use of [Tailwind CSS](https://tailwindcss.com/) in React Native. You can style your components by adding Tailwind CSS utility classes to the `className` prop.

For example:

```tsx
import { Text, View } from "react-native";

export default function MyComponent() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-lg font-bold text-blue-500">Hello, Tailwind!</Text>
    </View>
  );
}
```

## Learn more

To learn more about the technologies used in this project, check out the following resources:

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs)
- [NativeWind Documentation](https://www.nativewind.dev/v4/overview)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)