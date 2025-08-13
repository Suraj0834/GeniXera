const lightTheme = {
  background: '#FFFEFF',
  backgroundHome: '#FFFEF2', // light mode home background
  text: '#000',
  accent: '#D2BD00',
  button: '#D2BD00',
  buttonText: '#000',
  inputBackground: '#F8F8F8',
  inputBorder: '#E0E0E0',
  placeholder: '#666',
  card: '#FFF',
  border: '#E0E0E0',
  icon: '#D2BD00',
  BottomNavigationBackground: '#FFFEF3', // light mode bottom navigation
  overlay: 'rgba(0,0,0,0.4)',
  sideNavBackground: '#FFFEF3', // light mode sidenav
};

const darkTheme = {
  background: '#0e0c01',
  backgroundHome: '#0e0c01',
  text: '#fefdfdff', // softer white for posts
  accent: '#D2BD00',
  button: '#D2BD00',
  buttonText: '#000',
  inputBackground: '#222',
  inputBorder: '#333',
  placeholder: '#d5d5d5ff',
  card: '#181818',
  border: '#333',
  BottomNavigationBackground: '#0e0c01', // dark mode bottom navigation
  icon: '#D2BD00',
  overlay: 'rgba(0,0,0,0.7)',
  sideNavBackground: '#0E0C01', // dark mode sidenav
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

export const getTheme = (mode) => (mode === 'dark' ? darkTheme : lightTheme);