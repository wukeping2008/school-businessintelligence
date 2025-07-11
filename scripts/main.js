// 主要应用逻辑
class SchoolBIPortal {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.initializeDashboard();
        this.setupEventListeners();
    }

    // 设置导航功能
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = item.getAttribute('data-page');
                this.navigateToPage(targetPage);
            });
        });
    }

    // 页面导航
    navigateToPage(pageName) {
        // 隐藏所有页面
        const pages = document.querySelectorAll('.page');
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // 显示目标页面
        const targetPage = document.getElementById(pageName);
        if (targetPage) {
            targetPage.classList.add('active');
            this.currentPage = pageName;
        }

        // 更新导航状态
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-page') === pageName) {
                item.classList.add('active');
            }
        });

        // 初始化页面特定功能
        this.initializePage(pageName);
    }

    // 初始化特定页面
    initializePage(pageName) {
        switch (pageName) {
            case 'dashboard':
                this.initializeDashboard();
                break;
            case 'admission':
                this.initializeAdmission();
                break;
            case 'communication':
                this.initializeCommunication();
                break;
            case 'academic':
                this.initializeAcademic();
                break;
            case 'guidance':
                this.initializeGuidance();
                break;
        }
    }

    // 初始化仪表板
    initializeDashboard() {
        this.createOverviewChart();
    }

    // 创建概览图表
    createOverviewChart() {
        const ctx = document.getElementById('overviewChart');
        if (!ctx) return;

        // 销毁现有图表
        if (this.overviewChart) {
            this.overviewChart.destroy();
        }

        // 获取国际化标签
        const monthLabels = window.i18n && window.i18n.isEn() 
            ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
            : ['1月', '2月', '3月', '4月', '5月', '6月'];
            
        const datasetLabels = {
            admission: window.i18n ? window.i18n.t('home.admission.title') : '招生咨询',
            communication: window.i18n ? window.i18n.t('home.communication.title') : '家校互动',
            academic: window.i18n ? window.i18n.t('home.academic.title') : '学业报告'
        };

        this.overviewChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthLabels,
                datasets: [
                    {
                        label: datasetLabels.admission,
                        data: [120, 135, 140, 156, 165, 180],
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: datasetLabels.communication,
                        data: [280, 295, 310, 342, 358, 375],
                        borderColor: '#f093fb',
                        backgroundColor: 'rgba(240, 147, 251, 0.1)',
                        tension: 0.4,
                        fill: true
                    },
                    {
                        label: datasetLabels.academic,
                        data: [45, 52, 58, 65, 72, 78],
                        borderColor: '#4facfe',
                        backgroundColor: 'rgba(79, 172, 254, 0.1)',
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.1)'
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    }

    // 初始化招生模块
    initializeAdmission() {
        if (typeof AdmissionModule !== 'undefined') {
            this.admissionModule = new AdmissionModule();
        }
    }

    // 初始化家校沟通模块
    initializeCommunication() {
        if (typeof CommunicationModule !== 'undefined') {
            this.communicationModule = new CommunicationModule();
        }
    }

    // 初始化学业反馈模块
    initializeAcademic() {
        if (typeof AcademicModule !== 'undefined') {
            this.academicModule = new AcademicModule();
        }
    }

    // 初始化升学指导模块
    initializeGuidance() {
        if (typeof GuidanceModule !== 'undefined') {
            this.guidanceModule = new GuidanceModule();
        }
    }

    // 设置事件监听器
    setupEventListeners() {
        // 窗口大小改变时重新调整图表
        window.addEventListener('resize', () => {
            if (this.overviewChart) {
                this.overviewChart.resize();
            }
        });

        // 键盘导航支持
        document.addEventListener('keydown', (e) => {
            if (e.altKey) {
                switch (e.key) {
                    case '1':
                        this.navigateToPage('dashboard');
                        break;
                    case '2':
                        this.navigateToPage('admission');
                        break;
                    case '3':
                        this.navigateToPage('communication');
                        break;
                    case '4':
                        this.navigateToPage('academic');
                        break;
                    case '5':
                        this.navigateToPage('guidance');
                        break;
                }
            }
        });
    }

    // 显示加载状态
    showLoading(element) {
        if (element) {
            element.innerHTML = '<div class="loading"></div>';
        }
    }

    // 隐藏加载状态
    hideLoading(element, content) {
        if (element) {
            element.innerHTML = content;
        }
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;

        // 添加通知样式
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    padding: 15px 20px;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    z-index: 10000;
                    animation: slideIn 0.3s ease;
                    max-width: 400px;
                }
                .notification-success { border-left: 4px solid #28a745; }
                .notification-error { border-left: 4px solid #dc3545; }
                .notification-info { border-left: 4px solid #17a2b8; }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex: 1;
                }
                .notification-close {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #999;
                    padding: 5px;
                }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // 自动移除通知
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // 格式化日期
    formatDate(date) {
        if (typeof date === 'string') {
            date = new Date(date);
        }
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // 格式化时间
    formatTime(time) {
        if (typeof time === 'string') {
            const [hours, minutes] = time.split(':');
            return `${hours}:${minutes}`;
        }
        return time;
    }

    // 生成随机ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // 本地存储操作
    saveToStorage(key, data) {
        try {
            localStorage.setItem(key, JSON.stringify(data));
            return true;
        } catch (error) {
            console.error('保存数据失败:', error);
            return false;
        }
    }

    loadFromStorage(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('加载数据失败:', error);
            return null;
        }
    }

    // 数据验证
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    validatePhone(phone) {
        const re = /^1[3-9]\d{9}$/;
        return re.test(phone);
    }

    // 防抖函数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // 节流函数
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// 全局函数，供HTML调用
function navigateToPage(pageName) {
    if (window.app) {
        window.app.navigateToPage(pageName);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    window.app = new SchoolBIPortal();
    
    // 添加一些全局样式增强
    const enhancementStyles = document.createElement('style');
    enhancementStyles.textContent = `
        /* 平滑滚动 */
        html {
            scroll-behavior: smooth;
        }
        
        /* 选择文本样式 */
        ::selection {
            background: rgba(102, 126, 234, 0.3);
            color: #333;
        }
        
        /* 焦点样式 */
        *:focus {
            outline: 2px solid rgba(102, 126, 234, 0.5);
            outline-offset: 2px;
        }
        
        /* 按钮悬停效果增强 */
        .btn:not(:disabled):hover {
            transform: translateY(-1px);
        }
        
        /* 卡片悬停效果 */
        .dashboard-card,
        .academic-card,
        .report-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* 加载动画优化 */
        .loading {
            animation: spin 1s linear infinite;
        }
        
        /* 页面切换动画 */
        .page {
            transition: opacity 0.3s ease-in-out;
        }
        
        .page:not(.active) {
            opacity: 0;
            pointer-events: none;
        }
        
        .page.active {
            opacity: 1;
            pointer-events: auto;
        }
    `;
    document.head.appendChild(enhancementStyles);
    
    console.log('国际学校商业智能门户系统已初始化');
});

// 导出供其他模块使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SchoolBIPortal;
}
