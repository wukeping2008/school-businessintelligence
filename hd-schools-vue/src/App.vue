<template>
  <div class="app-container">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-content">
        <div class="logo">
          <i class="fas fa-shield-alt"></i>
          <div>
            <div style="font-size: 24px; font-weight: bold;">HD SCHOOLS</div>
            <div style="font-size: 12px; opacity: 0.8;">{{ t('nav.logo') }}</div>
          </div>
        </div>
        <nav class="nav-menu">
          <router-link 
            to="/" 
            class="nav-item" 
            :class="{ active: $route.name === 'home' }"
          >
            <i class="fas fa-tachometer-alt"></i>
            <span>{{ t('nav.dashboard') }}</span>
          </router-link>
          <router-link 
            to="/admission" 
            class="nav-item" 
            :class="{ active: $route.name === 'admission' }"
          >
            <i class="fas fa-user-plus"></i>
            <span>{{ t('nav.admission') }}</span>
          </router-link>
          <router-link 
            to="/admission-ai" 
            class="nav-item" 
            :class="{ active: $route.name === 'admissionAI' }"
          >
            <i class="fas fa-robot"></i>
            <span>{{ t('nav.admissionAI') }}</span>
          </router-link>
          <router-link 
            to="/communication" 
            class="nav-item" 
            :class="{ active: $route.name === 'communication' }"
          >
            <i class="fas fa-comments"></i>
            <span>{{ t('nav.communication') }}</span>
          </router-link>
          <router-link 
            to="/academic" 
            class="nav-item" 
            :class="{ active: $route.name === 'academic' }"
          >
            <i class="fas fa-chart-line"></i>
            <span>{{ t('nav.academic') }}</span>
          </router-link>
          <router-link 
            to="/guidance" 
            class="nav-item" 
            :class="{ active: $route.name === 'guidance' }"
          >
            <i class="fas fa-route"></i>
            <span>{{ t('nav.guidance') }}</span>
          </router-link>
          <router-link 
            to="/teacher-dashboard" 
            class="nav-item" 
            :class="{ active: $route.path.startsWith('/teacher-dashboard') }"
          >
            <i class="fas fa-chalkboard-teacher"></i>
            <span>{{ t('nav.teacherDashboard') }}</span>
          </router-link>
        </nav>
        <div class="header-actions">
          <div class="campus-selector">
            <select v-model="campusStore.currentCampus" @change="handleCampusChange">
              <option value="shanghai">{{ t('campus.shanghai') }}</option>
              <option value="beijing">{{ t('campus.beijing') }}</option>
              <option value="ningbo">{{ t('campus.ningbo') }}</option>
            </select>
          </div>
          <div class="language-toggle">
            <button 
              class="lang-btn" 
              :class="{ active: i18nStore.currentLanguage === 'zh' }"
              @click="i18nStore.setLanguage('zh')"
            >
              中
            </button>
            <button 
              class="lang-btn" 
              :class="{ active: i18nStore.currentLanguage === 'en' }"
              @click="i18nStore.setLanguage('en')"
            >
              EN
            </button>
          </div>
          <div class="user-info">
            <i class="fas fa-user-circle"></i>
            <span>{{ t('user.welcome') }}</span>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useCampusStore } from './stores/campus'
import { useI18nStore } from './stores/i18n'
import type { Campus } from './types'

const campusStore = useCampusStore()
const i18nStore = useI18nStore()

// 翻译函数
const t = (key: string): string => {
  return i18nStore.t(key)
}

// 校区切换处理函数
const handleCampusChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  campusStore.switchCampus(target.value as Campus)
}
</script>

<style>
/* 全局样式已在 main.css 中定义 */
</style>
