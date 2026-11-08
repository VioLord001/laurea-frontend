'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  en: {
    // Navbar
    women: 'Women',
    men: 'Men',
    kids: 'Kids',
    bags: 'Bags',
    jewellery: 'Jewellery',
    shoes: 'Shoes',
    beauty: 'Beauty',
    home: 'Home',
    login: 'Login',
    logout: 'Logout',
    bag: 'Bag',
    search: 'Search',
    // Homepage
    heroTitle: 'New Season Arrivals',
    heroSubtitle: 'Discover the latest trends in fashion',
    shopNow: 'Shop Now',
    featuredProducts: 'Featured Products',
    newArrivals: 'New Arrivals',
    // Products
    addToBag: 'Add to bag',
    addedToBag: 'Added to bag!',
    selectSize: 'Select Size',
    selectColor: 'Select Color',
    // Auth
    welcomeBack: 'Welcome back',
    signIn: 'Sign in',
    signInAccount: 'Sign in to your Laurea account',
    email: 'Email',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    signingIn: 'Signing in...',
    newToLaurea: 'New to Laurea?',
    createAccount: 'Create an account',
    createYourAccount: 'Create your account',
    joinCommunity: 'Join the Laurea community',
    firstName: 'First name',
    lastName: 'Last name',
    creatingAccount: 'Creating account...',
    alreadyHaveAccount: 'Already have an account?',
    // Verification
    checkEmail: 'Check your email',
    verifyEmail: 'Verify Email',
    verifyLogin: 'Verify & Sign In',
    didNotReceive: 'Did not receive the code?',
    resendCode: 'Resend code',
    // Cart
    yourBag: 'Your Bag',
    emptyBag: 'Your bag is empty',
    continueShopping: 'Continue Shopping',
    orderSummary: 'Order Summary',
    checkout: 'Proceed to Checkout',
    // General
    freeDelivery: 'Free delivery on orders over $30',
    useCode: 'Use code',
    off: 'off',
  },
  pt: {
    // Navbar
    women: 'Feminino',
    men: 'Masculino',
    kids: 'Infantil',
    bags: 'Bolsas',
    jewellery: 'Joias',
    shoes: 'Sapatos',
    beauty: 'Beleza',
    home: 'Casa',
    login: 'Entrar',
    logout: 'Sair',
    bag: 'Sacola',
    search: 'Pesquisar',
    // Homepage
    heroTitle: 'Novidades da Temporada',
    heroSubtitle: 'Descubra as últimas tendências da moda',
    shopNow: 'Compre Agora',
    featuredProducts: 'Produtos em Destaque',
    newArrivals: 'Novidades',
    // Products
    addToBag: 'Adicionar à sacola',
    addedToBag: 'Adicionado!',
    selectSize: 'Selecione o Tamanho',
    selectColor: 'Selecione a Cor',
    // Auth
    welcomeBack: 'Bem-vindo de volta',
    signIn: 'Entrar',
    signInAccount: 'Entre na sua conta Laurea',
    email: 'E-mail',
    password: 'Senha',
    forgotPassword: 'Esqueceu a senha?',
    signingIn: 'Entrando...',
    newToLaurea: 'Novo na Laurea?',
    createAccount: 'Criar uma conta',
    createYourAccount: 'Crie sua conta',
    joinCommunity: 'Junte-se à comunidade Laurea',
    firstName: 'Nome',
    lastName: 'Sobrenome',
    creatingAccount: 'Criando conta...',
    alreadyHaveAccount: 'Já tem uma conta?',
    // Verification
    checkEmail: 'Verifique seu e-mail',
    verifyEmail: 'Verificar E-mail',
    verifyLogin: 'Verificar e Entrar',
    didNotReceive: 'Não recebeu o código?',
    resendCode: 'Reenviar código',
    // Cart
    yourBag: 'Sua Sacola',
    emptyBag: 'Sua sacola está vazia',
    continueShopping: 'Continuar Comprando',
    orderSummary: 'Resumo do Pedido',
    checkout: 'Finalizar Compra',
    // General
    freeDelivery: 'Frete grátis em pedidos acima de $30',
    useCode: 'Use o código',
    off: 'de desconto',
  },
  es: {
    // Navbar
    women: 'Mujer',
    men: 'Hombre',
    kids: 'Niños',
    bags: 'Bolsos',
    jewellery: 'Joyería',
    shoes: 'Zapatos',
    beauty: 'Belleza',
    home: 'Hogar',
    login: 'Iniciar sesión',
    logout: 'Cerrar sesión',
    bag: 'Bolsa',
    search: 'Buscar',
    // Homepage
    heroTitle: 'Novedades de Temporada',
    heroSubtitle: 'Descubre las últimas tendencias en moda',
    shopNow: 'Comprar Ahora',
    featuredProducts: 'Productos Destacados',
    newArrivals: 'Novedades',
    // Products
    addToBag: 'Añadir a la bolsa',
    addedToBag: '¡Añadido!',
    selectSize: 'Seleccionar Talla',
    selectColor: 'Seleccionar Color',
    // Auth
    welcomeBack: 'Bienvenido de nuevo',
    signIn: 'Iniciar sesión',
    signInAccount: 'Inicia sesión en tu cuenta Laurea',
    email: 'Correo electrónico',
    password: 'Contraseña',
    forgotPassword: '¿Olvidaste tu contraseña?',
    signingIn: 'Iniciando sesión...',
    newToLaurea: '¿Nuevo en Laurea?',
    createAccount: 'Crear una cuenta',
    createYourAccount: 'Crea tu cuenta',
    joinCommunity: 'Únete a la comunidad Laurea',
    firstName: 'Nombre',
    lastName: 'Apellido',
    creatingAccount: 'Creando cuenta...',
    alreadyHaveAccount: '¿Ya tienes una cuenta?',
    // Verification
    checkEmail: 'Revisa tu correo',
    verifyEmail: 'Verificar Correo',
    verifyLogin: 'Verificar e Iniciar sesión',
    didNotReceive: '¿No recibiste el código?',
    resendCode: 'Reenviar código',
    // Cart
    yourBag: 'Tu Bolsa',
    emptyBag: 'Tu bolsa está vacía',
    continueShopping: 'Seguir Comprando',
    orderSummary: 'Resumen del Pedido',
    checkout: 'Proceder al Pago',
    // General
    freeDelivery: 'Envío gratis en pedidos superiores a $30',
    useCode: 'Usa el código',
    off: 'de descuento',
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');
  const [detected, setDetected] = useState(false);

  useEffect(() => {
    const detectLanguage = async () => {
      try {
        // Check if user already chose a language
        const saved = localStorage.getItem('laurea_lang');
        if (saved) { setLang(saved); setDetected(true); return; }

        // Detect by IP location
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        const country = data.country_code;

        // Portuguese speaking countries
        const ptCountries = ['BR', 'PT', 'AO', 'MZ', 'CV', 'GW', 'ST', 'TL'];
        // Spanish speaking countries
        const esCountries = ['MX', 'ES', 'AR', 'CO', 'PE', 'VE', 'CL', 'EC', 'GT', 'CU', 'BO', 'DO', 'HN', 'PY', 'SV', 'NI', 'CR', 'PA', 'UY', 'GQ'];

        if (ptCountries.includes(country)) {
          setLang('pt');
          localStorage.setItem('laurea_lang', 'pt');
        } else if (esCountries.includes(country)) {
          setLang('es');
          localStorage.setItem('laurea_lang', 'es');
        } else {
          setLang('en');
          localStorage.setItem('laurea_lang', 'en');
        }
      } catch {
        setLang('en');
      }
      setDetected(true);
    };
    detectLanguage();
  }, []);

  const t = (key) => translations[lang][key] || translations['en'][key] || key;

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem('laurea_lang', newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, t, changeLang, detected }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);