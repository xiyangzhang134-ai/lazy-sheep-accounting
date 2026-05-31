package com.lazysheep.accounting

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.lazysheep.accounting.ui.components.BottomNavBar
import com.lazysheep.accounting.ui.components.SplashScreen
import com.lazysheep.accounting.ui.navigation.AppNavigation
import com.lazysheep.accounting.ui.navigation.Routes
import com.lazysheep.accounting.ui.theme.LazySheepTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            LazySheepTheme {
                var showSplash by remember { mutableStateOf(true) }

                if (showSplash) {
                    SplashScreen(onDone = { showSplash = false })
                } else {
                    val navController = rememberNavController()
                    val navBackStackEntry by navController.currentBackStackEntryAsState()
                    val currentRoute = navBackStackEntry?.destination?.route

                    Scaffold(
                        modifier = Modifier.fillMaxSize(),
                        bottomBar = {
                            if (currentRoute != null) {
                                BottomNavBar(
                                    currentRoute = currentRoute,
                                    onNavigate = { route ->
                                        if (route != currentRoute) {
                                            navController.navigate(route) {
                                                popUpTo(Routes.HOME) { saveState = true }
                                                launchSingleTop = true
                                                restoreState = true
                                            }
                                        }
                                    }
                                )
                            }
                        }
                    ) { innerPadding ->
                        Box(modifier = Modifier.padding(innerPadding)) {
                            AppNavigation(navController = navController)
                        }
                    }
                }
            }
        }
    }
}
