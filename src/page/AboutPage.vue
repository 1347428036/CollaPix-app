<template>
  <div id="about-page">
    <!-- 1. Enhanced Header -->
    <a-page-header class="hero-section">
      <template #extra>
        <a-button type="primary">Free Trial</a-button>
        <a-button>Demo Video</a-button>
      </template>

      <a-typography-title class="hero-title">Smart Visual Asset Management</a-typography-title>
      <a-typography-text class="hero-subtitle"
        >Maximizing Value with Digital Assets</a-typography-text
      >

      <a-carousel autoplay class="hero-carousel">
        <a-image :width="500" v-for="(img, i) in carouselImages" :key="i" :src="img" />
      </a-carousel>
    </a-page-header>

    <!-- 2. Core Value Module -->
    <a-row class="value-section" :gutter="[24, 48]">
      <a-col :xs="24" :md="8" v-for="(item, index) in features" :key="index">
        <a-card hoverable class="feature-card">
          <template #actions>
            <a-tooltip :title="item.tooltip">
              <a-button type="link" shape="circle" :icon="h(item.icon)" />
            </a-tooltip>
          </template>
          <a-card-meta :title="item.title" :description="item.description" class="feature-meta" />
        </a-card>
      </a-col>
    </a-row>

    <!-- 3. Data Display -->
    <div class="stats-section">
      <a-statistic
        title="Served Enterprises"
        :value="32000"
        :precision="0"
        suffix="+"
        class="stats-item"
      />
      <a-statistic
        title="Managed Assets"
        :value="115"
        :precision="0"
        suffix="Billion+"
        class="stats-item"
      />
      <a-statistic
        title="Response Speed"
        :value="98.7"
        :precision="1"
        suffix="%"
        class="stats-item"
      />
    </div>

    <!-- 4. Partners -->
    <a-divider orientation="left">Technical Partners</a-divider>
    <a-space class="partner-section" :size="48" wrap>
      <a-card v-for="(logo, i) in partners" :key="i" hoverable class="partner-card">
        <img :src="logo" class="partner-logo" />
      </a-card>
    </a-space>
    <!-- 5. Enhanced CTA -->
    <a-affix :offset-bottom="60" class="cta-affix">
      <a-card class="cta-card">
        <a-space :size="48">
          <a-button type="primary" shape="round" size="large">
            <template #icon><rocket-outlined /></template>
            Get Started Now
          </a-button>
          <a-button size="large">
            <template #icon><message-outlined /></template>
            Consult an Expert
          </a-button>
        </a-space>
      </a-card>
    </a-affix>
  </div>
</template>

<script lang="ts" setup>
import {
  RocketOutlined,
  MessageOutlined,
  CloudOutlined,
  LockOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons-vue'
import { h } from 'vue'

const carouselImages = [
  'https://cloudpicture.bucket.esmiao.top/public/1883745341837864962/2025-03-07_QYT4txRYK3xrAHvo.webp',
]

const features = [
  {
    icon: CloudOutlined,
    title: 'Cloud Intelligent Management',
    description: 'Real-time synchronization across platforms, supports TB-level data storage',
    tooltip: 'View Technical Whitepaper',
  },
  {
    icon: LockOutlined,
    title: 'Financial Grade Security',
    description: 'AES-256 encryption + Blockchain Notarization',
    tooltip: 'View Security Certification',
  },
  {
    icon: ThunderboltOutlined,
    title: 'Ultrafast Performance',
    description: 'Global CDN acceleration, 90% files loaded in seconds',
    tooltip: 'View Performance Report',
  },
]

const partners = [
  'https://tse3-mm.cn.bing.net/th/id/OIP-C.EnFNIXVxRLMOwjPdVzDpQwHaDV?w=308&h=157&c=7&r=0&o=5&pid=1.7',
  'https://tse3-mm.cn.bing.net/th/id/OIP-C.EnFNIXVxRLMOwjPdVzDpQwHaDV?w=308&h=157&c=7&r=0&o=5&pid=1.7',
  'https://tse3-mm.cn.bing.net/th/id/OIP-C.EnFNIXVxRLMOwjPdVzDpQwHaDV?w=308&h=157&c=7&r=0&o=5&pid=1.7',
]
</script>

<style>
#about-page {
  padding-bottom: 3.5rem;
}
/* Header Optimization */
.hero-section {
  min-height: 70vh;
  background: linear-gradient(135deg, #2a5caa 0%, #e0e7f0 100%);
}

.hero-title {
  color: white !important;
  font-size: 2.5rem !important;
  margin-top: 64px !important;
}

.hero-subtitle {
  color: rgba(255, 255, 255, 0.9) !important;
  font-size: 1.2rem;
}

/* Feature Card Enhancement */
.feature-card {
  transition: transform 0.3s;
  border-radius: 12px !important;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-meta .ant-card-meta-title {
  font-size: 1.3rem !important;
  color: #2a5caa;
}

/* Data Statistic Group */
.stats-section {
  padding: 48px 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 32px;
}

.stats-item .ant-statistic-title {
  font-size: 1.1rem !important;
}

.stats-item .ant-statistic-content {
  font-size: 2.2rem !important;
}

/* Partner Cards */
.partner-card {
  border-radius: 8px !important;
  padding: 16px;
}

.partner-logo {
  height: 40px;
  filter: grayscale(1);
  transition: filter 0.3s;
}

.partner-card:hover .partner-logo {
  filter: none;
}

/* Floating CTA */
.cta-affix .ant-affix {
  /* position: fixed;
  right: 24px;
  bottom: 67px;
  z-index: 100; */
}
.cta-card {
  border-radius: 50px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 1.8rem !important;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .cta-affix .ant-affix {
    left: 24px;
    right: auto;
  }
}
</style>
