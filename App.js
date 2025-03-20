"use client"

import { useState, useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Provider as PaperProvider } from "react-native-paper"
import { NativeBaseProvider, extendTheme } from "native-base"
import { Ionicons } from "@expo/vector-icons"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Pantallas de usuario
import HomeScreen from "./src/screens/HomeScreen"
import QuoteScreen from "./src/screens/QuoteScreen"
import ProfileScreen from "./src/screens/ProfileScreen"
import LoginScreen from "./src/screens/LoginScreen"
import RegisterScreen from "./src/screens/RegisterScreen"
import OnboardingScreen from "./src/screens/OnboardingScreen"
import CreateReportScreen from "./src/screens/CreateReportScreen"
import TrackReportsScreen from "./src/screens/TrackReportsScreen"

import EditProfileScreen from "./src/screens/editProfile";
import MyVehicleScreen from "./src/screens/myVehicle";
import PolizeScreen from "./src/screens/Polizes";

// Pantallas de administrador
import AdminDashboardScreen from "./src/screens/admin/AdminDashboardScreen"
import AdminUsersScreen from "./src/screens/admin/AdminUsersScreen"
import AdminClaimsScreen from "./src/screens/admin/AdminClaimsScreen"
import AdminRegisterScreen from "./src/screens/admin/AdminRegisterScreen"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()
const AdminTab = createBottomTabNavigator()
const HomeStack = createStackNavigator()
const AdminStack = createStackNavigator()
const ProfileStack = createStackNavigator()

const theme = extendTheme({
  colors: {
    primary: {
      50: "#E3F2FD",
      100: "#BBDEFB",
      500: "#2196F3",
      600: "#1E88E5",
    },
    secondary: {
      500: "#9c27b0",
      600: "#8e24aa",
    },
    tertiary: {
      500: "#00a0b0",
      600: "#008a99",
    },
  },
})

const ProfileStackScreen = () => {
  <ProfileStack.Navigator screenOptions={{headerShown: false}}>
    <ProfileStack.Screen name="ProfileScreen" component={ProfileScreen}/>
    <ProfileStack.Screen name="editPerfil" component={EditProfileScreen}/>
    <ProfileStack.Screen name="myVehicles" component={MyVehicleScreen}/>
    <ProfileStack.Screen name="Polizes" component={PolizeScreen}/>
  </ProfileStack.Navigator>
}


// Stack para la sección de inicio
const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} />
    <HomeStack.Screen name="CreateReport" component={CreateReportScreen} />
    <HomeStack.Screen name="TrackReports" component={TrackReportsScreen} />
  </HomeStack.Navigator>
)

// Stack para la sección de administración de usuarios
const AdminUsersStackScreen = () => (
  <AdminStack.Navigator screenOptions={{ headerShown: false }}>
    <AdminStack.Screen name="AdminUsersList" component={AdminUsersScreen} />
    <AdminStack.Screen name="AdminRegister" component={AdminRegisterScreen} />
  </AdminStack.Navigator>
)

// Navegación para usuarios normales
const UserTabNavigator = ({ handleLogout }) => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName
        if (route.name === "Inicio") {
          iconName = focused ? "home" : "home-outline"
        } else if (route.name === "Cotizar") {
          iconName = focused ? "calculator" : "calculator-outline"
        } else if (route.name === "Perfil") {
          iconName = focused ? "person" : "person-outline"
        }
        return <Ionicons name={iconName} size={size} color={color} />
      },
      tabBarActiveTintColor: "#2196F3",
      tabBarInactiveTintColor: "gray",
    })}
  >
    <Tab.Screen name="Inicio" options={{ headerShown: true }}>
      {(props) => <HomeStackScreen {...props} />}
    </Tab.Screen>
    <Tab.Screen name="Cotizar" component={QuoteScreen} />
    <Tab.Screen name="Perfil">
      {(props) => <ProfileStackScreen {...props} handleLogout={handleLogout} />}
    </Tab.Screen>
  </Tab.Navigator>
)

// Navegación para administradores
const AdminTabNavigator = ({ handleLogout }) => (
  <AdminTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName
        if (route.name === "Inicio") {
          iconName = focused ? "home" : "home-outline"
        } else if (route.name === "Usuarios") {
          iconName = focused ? "people" : "people-outline"
        } else if (route.name === "Reclamos") {
          iconName = focused ? "alert-circle" : "alert-circle-outline"
        } else if (route.name === "Perfil") {
          iconName = focused ? "person" : "person-outline"
        }
        return <Ionicons name={iconName} size={size} color={color} />
      },
      tabBarActiveTintColor: "#2196F3", // Color diferente para distinguir
      tabBarInactiveTintColor: "gray",
    })}
  >
    <AdminTab.Screen name="Inicio" component={AdminDashboardScreen} />
    <AdminTab.Screen name="Usuarios" component={AdminUsersStackScreen} />
    <AdminTab.Screen name="Reclamos" component={AdminClaimsScreen} />
    <AdminTab.Screen name="Perfil">
      {(props) => <ProfileScreen {...props} handleLogout={handleLogout} isAdmin={true} />}
    </AdminTab.Screen>
  </AdminTab.Navigator>
)

export default function App() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    checkUserSession()
  }, [])

  const checkUserSession = async () => {
    try {
      const userData = await AsyncStorage.getItem("@user_data")
      if (userData) {
        setUser(JSON.parse(userData))
      }
    } catch (error) {
      console.error("Error retrieving user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (userData) => {
    try {
      await AsyncStorage.setItem("@user_data", JSON.stringify(userData))
      setUser(userData)
    } catch (error) {
      console.error("Error saving user data:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@user_data")
      setUser(null)
    } catch (error) {
      console.error("Error removing user data:", error)
    }
  }

  if (isLoading) {
    return null // O un componente de loading
  }

  return (
    <NativeBaseProvider theme={theme}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!user ? (
              <>
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="Login">
                  {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
                </Stack.Screen>
                <Stack.Screen name="Register">
                  {(props) => <RegisterScreen {...props} onLogin={handleLogin} />}
                </Stack.Screen>
              </>
            ) : user.isAdmin ? (
              // Navegación para administradores
              <Stack.Screen name="AdminApp">
                {(props) => <AdminTabNavigator {...props} handleLogout={handleLogout} />}
              </Stack.Screen>
            ) : (
              // Navegación para usuarios normales
              <Stack.Screen name="MainApp">
                {(props) => <UserTabNavigator {...props} handleLogout={handleLogout} />}
              </Stack.Screen>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </NativeBaseProvider>
  )
}