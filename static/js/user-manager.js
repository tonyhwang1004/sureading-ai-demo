// 사용자 관리 시스템 (어학원용)
class UserManager {
    constructor() {
        this.currentUser = this.getCurrentUser();
        this.initializeUserSystem();
    }
    
    // 현재 사용자 정보 가져오기
    getCurrentUser() {
        const user = localStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }
    
    // 사용자 인증 상태 확인
    isLoggedIn() {
        return this.currentUser && this.currentUser.isLoggedIn;
    }
    
    // 사용자 시스템 초기화
    initializeUserSystem() {
        // 로그인 페이지는 제외
        if (window.location.pathname.includes('login.html')) {
            return;
        }
        
        if (this.isLoggedIn()) {
            this.showUserInfo();
            this.loadUserProgress();
        } else {
            this.redirectToLogin();
        }
    }
    
    // 로그인 페이지로 리다이렉트
    redirectToLogin() {
        if (!window.location.pathname.includes('login.html')) {
            alert('⚠️ 로그인이 필요합니다.');
            window.location.href = 'login.html';
        }
    }
    
    // 사용자 정보 표시
    showUserInfo() {
        const roleIcon = this.currentUser.role === 'teacher' ? '👩‍🏫' : '👤';
        const roleText = this.currentUser.role === 'teacher' ? '선생님' : '학생';
        
        const userInfoHtml = `
            <div class="user-info-bar" style="
                background: linear-gradient(90deg, #28a745, #20c997);
                color: white;
                padding: 10px 20px;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
                display: flex;
                justify-content: space-between;
                align-items: center;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            ">
                <div>
                    <span style="font-weight: bold;">${roleIcon} ${this.currentUser.name} (${roleText})</span>
                    <span style="margin-left: 15px; opacity: 0.9;">🏫 SureReading 어학원</span>
                </div>
                <div>
                    <span id="user-progress" style="margin-right: 15px;">📊 진도: 로딩중...</span>
                    <button onclick="userManager.showProfile()" style="
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        padding: 5px 15px;
                        border-radius: 15px;
                        cursor: pointer;
                        font-size: 0.9rem;
                        margin-right: 5px;
                    ">📊 내 정보</button>
                    <button onclick="userManager.logout()" style="
                        background: rgba(255,255,255,0.2);
                        border: none;
                        color: white;
                        padding: 5px 15px;
                        border-radius: 15px;
                        cursor: pointer;
                        font-size: 0.9rem;
                    ">🔓 로그아웃</button>
                </div>
            </div>
        `;
        
        // 페이지 상단에 사용자 정보 추가
        document.body.insertAdjacentHTML('afterbegin', userInfoHtml);
        
        // 기존 콘텐츠를 아래로 밀기
        document.body.style.paddingTop = '60px';
    }
    
    // 사용자 진도 로드
    loadUserProgress() {
        const progressKey = `progress_${this.currentUser.email}`;
        const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
        
        const totalBooks = 6;
        const completedBooks = Object.keys(progress).filter(bookId => 
            progress[bookId] && progress[bookId].completed > 0
        ).length;
        const totalQuestions = Object.values(progress).reduce((sum, book) => 
            sum + (book.completed || 0), 0
        );
        
        const progressElement = document.getElementById('user-progress');
        if (progressElement) {
            progressElement.textContent = 
                `📊 완료: ${completedBooks}/${totalBooks}권, 문제: ${totalQuestions}개`;
        }
    }
    
    // 학습 진도 저장
    saveProgress(bookId, questionIndex, score, isCorrect) {
        const progressKey = `progress_${this.currentUser.email}`;
        const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
        
        if (!progress[bookId]) {
            progress[bookId] = {
                bookTitle: '',
                completed: 0,
                totalQuestions: 0,
                scores: [],
                lastAccess: new Date().toISOString(),
                bestScore: 0
            };
        }
        
        progress[bookId].scores.push({
            questionIndex,
            score,
            isCorrect,
            timestamp: new Date().toISOString()
        });
        
        progress[bookId].completed = progress[bookId].scores.length;
        progress[bookId].lastAccess = new Date().toISOString();
        
        // 최고 점수 업데이트
        const avgScore = progress[bookId].scores.reduce((sum, s) => sum + s.score, 0) / progress[bookId].scores.length;
        progress[bookId].bestScore = Math.max(progress[bookId].bestScore, avgScore);
        
        localStorage.setItem(progressKey, JSON.stringify(progress));
        
        // 진도 표시 업데이트
        this.loadUserProgress();
        
        console.log(`📊 진도 저장: ${bookId} - 문제 ${questionIndex}, 점수: ${score}`);
    }
    
    // 특정 책의 진도 가져오기
    getBookProgress(bookId) {
        const progressKey = `progress_${this.currentUser.email}`;
        const progress = JSON.parse(localStorage.getItem(progressKey) || '{}');
        return progress[bookId] || null;
    }
    
    // 전체 진도 가져오기
    getAllProgress() {
        const progressKey = `progress_${this.currentUser.email}`;
        return JSON.parse(localStorage.getItem(progressKey) || '{}');
    }
    
    // 사용자 프로필 표시
    showProfile() {
        const progress = this.getAllProgress();
        const totalBooks = Object.keys(progress).length;
        const totalQuestions = Object.values(progress).reduce((sum, book) => sum + (book.completed || 0), 0);
        const avgScore = totalQuestions > 0 ? 
            Object.values(progress).reduce((sum, book) => 
                sum + (book.bestScore || 0), 0) / totalBooks : 0;
        
        const profileInfo = `
📊 ${this.currentUser.name}님의 학습 현황

📚 학습한 책: ${totalBooks}권
❓ 푼 문제: ${totalQuestions}개
🎯 평균 점수: ${Math.round(avgScore)}점
📅 가입일: ${new Date(this.currentUser.loginTime).toLocaleDateString()}

🏫 어학원 시스템에서 모든 학습 기록이
자동으로 저장되고 있습니다.
        `;
        
        alert(profileInfo);
    }
    
    // 로그아웃
    logout() {
        if (confirm('🔓 정말 로그아웃하시겠습니까?\n(진도는 자동 저장됩니다)')) {
            localStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        }
    }
}

// 전역 사용자 관리자 생성
window.userManager = new UserManager();

console.log('👤 사용자 관리 시스템 초기화 완료');
