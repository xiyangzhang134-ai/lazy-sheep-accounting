package com.lazysheep.accounting

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import com.lazysheep.accounting.ui.components.BottomNavBar
import com.lazysheep.accounting.ui.components.SplashScreen
import com.lazysheep.accounting.ui.screens.AchievementScreen
import com.lazysheep.accounting.ui.screens.HomeScreen
import com.lazysheep.accounting.ui.screens.TrendScreen
import com.lazysheep.accounting.ui.theme.LazySheepTheme
import com.lazysheep.accounting.ui.viewmodel.AchievementViewModel
import com.lazysheep.accounting.ui.viewmodel.HomeViewModel
import com.lazysheep.accounting.ui.viewmodel.TrendViewModel
import kotlinx.coroutines.launch

private val TABS = listOf("home", "trend", "achievement")

class MainActivity : ComponentActivity() {
    @OptIn(ExperimentalFoundationApi::class)
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        setContent {
            LazySheepTheme {
                var showSplash by remember { mutableStateOf(true) }

                if (showSplash) {
                    SplashScreen(onDone = { showSplash = false })
                } else {
                    val pagerState = rememberPagerState(pageCount = { 3 })
                    val coroutineScope = rememberCoroutineScope()
                    val currentRoute = TABS[pagerState.currentPage]

                    Scaffold(
                        modifier = Modifier.fillMaxSize(),
                        bottomBar = {
                            BottomNavBar(
                                currentRoute = currentRoute,
                                onNavigate = { route ->
                                    val idx = TABS.indexOf(route)
                                    if (idx >= 0) {
                                        coroutineScope.launch {
                                            pagerState.animateScrollToPage(idx)
                                        }
                                    }
                                }
                            )
                        }
                    ) { innerPadding ->
                        HorizontalPager(
                            state = pagerState,
                            modifier = Modifier
                                .fillMaxSize()
                                .padding(innerPadding)
                        ) { page ->
                            when (page) {
                                0 -> HomeScreen(
                                    viewModel = viewModel(),
                                    onNavigate = {}
                                )
                                1 -> TrendScreen(
                                    viewModel = viewModel(),
                                    onBack = {}
                                )
                                2 -> AchievementScreen(
                                    viewModel = viewModel(),
                                    onBack = {}
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}
