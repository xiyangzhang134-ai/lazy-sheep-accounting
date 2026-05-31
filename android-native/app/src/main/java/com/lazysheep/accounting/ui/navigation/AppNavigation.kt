package com.lazysheep.accounting.ui.navigation

import androidx.compose.runtime.Composable
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import com.lazysheep.accounting.ui.screens.AchievementScreen
import com.lazysheep.accounting.ui.screens.HomeScreen
import com.lazysheep.accounting.ui.screens.TrendScreen
import com.lazysheep.accounting.ui.viewmodel.AchievementViewModel
import com.lazysheep.accounting.ui.viewmodel.HomeViewModel
import com.lazysheep.accounting.ui.viewmodel.TrendViewModel

object Routes {
    const val HOME = "home"
    const val TREND = "trend"
    const val ACHIEVEMENT = "achievement"
}

@Composable
fun AppNavigation(navController: NavHostController) {
    NavHost(
        navController = navController,
        startDestination = Routes.HOME
    ) {
        composable(Routes.HOME) {
            val vm: HomeViewModel = viewModel()
            HomeScreen(
                viewModel = vm,
                onNavigate = { route ->
                    if (route != Routes.HOME) {
                        navController.navigate(route) {
                            launchSingleTop = true
                        }
                    }
                }
            )
        }

        composable(Routes.TREND) {
            val vm: TrendViewModel = viewModel()
            TrendScreen(
                viewModel = vm,
                onBack = { navController.popBackStack() }
            )
        }

        composable(Routes.ACHIEVEMENT) {
            val vm: AchievementViewModel = viewModel()
            AchievementScreen(
                viewModel = vm,
                onBack = { navController.popBackStack() }
            )
        }
    }
}
