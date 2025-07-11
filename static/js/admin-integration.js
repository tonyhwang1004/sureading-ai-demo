// Sue Reading Academy - 관리자 통합 스크립트
console.log('🔧 Sue Reading Academy 관리자 시스템 로딩...');

document.addEventListener('DOMContentLoaded', function() {
    if (typeof window.SUREADING_DATA !== 'undefined') {
        console.log('✅ AI 번들 데이터 로딩 성공!');
        initializeAdminSystem();
    } else {
        console.log('⏳ AI 번들 로딩 대기...');
        setTimeout(() => {
            if (typeof window.SUREADING_DATA !== 'undefined') {
                initializeAdminSystem();
            } else {
                console.error('❌ AI 번들 로딩 실패');
            }
        }, 2000);
    }
});

function initializeAdminSystem() {
    const currentPage = window.location.pathname;
    
    // 페이지별 초기화
    if (currentPage.includes('admin-books-detail') || currentPage.includes('admin_books')) {
        initializeBooksAdmin();
    } else if (currentPage.includes('admin_dashboard')) {
        initializeDashboard();
    } else if (currentPage.includes('admin_analytics')) {
        initializeAnalytics();
    } else if (currentPage.includes('admin_students')) {
        initializeStudentsAdmin();
    }
    
    // 공통 AI 통계 표시
    displayAISystemStats();
}

function displayAISystemStats() {
    const data = window.SUREADING_DATA;
    if (!data) return;
    
    const totalQuestions = getTotalQuestionCount();
    
    // AI 시스템 통계 박스 추가
    const statsHtml = `
        <div class="ai-system-stats" style="
            background: linear-gradient(45deg, #28a745, #20c997);
            color: white;
            padding: 20px;
            border-radius: 15px;
            margin: 20px 0;
            box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3);
        ">
            <h3>🤖 Sue Reading Academy 시스템 현황</h3>
            <div style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
                gap: 15px;
                margin-top: 15px;
            ">
                <div><strong>📚 총 도서:</strong> ${data.metadata.totalBooks}권</div>
                <div><strong>❓ 문제 세트:</strong> ${data.metadata.totalQuestions}개</div>
                <div><strong>🤖 AI 문제:</strong> ${totalQuestions}개</div>
                <div><strong>✅ 상태:</strong> AI 운영 중</div>
            </div>
            <div style="margin-top: 10px; font-size: 0.9rem; opacity: 0.9;">
                🔗 <a href="quiz.html?book=PP001" style="color: white; text-decoration: underline;">문제 풀이 테스트</a> |
                🤖 <a href="generator.html" style="color: white; text-decoration: underline;">AI 생성기</a> |
                📚 <a href="books.html" style="color: white; text-decoration: underline;">도서 탐색</a>
            </div>
        </div>
    `;
    
    // 페이지의 적절한 위치에 추가
    insertStatsIntoPage(statsHtml);
}

function insertStatsIntoPage(statsHtml) {
    const targetSelectors = [
        '.main-content',
        '.container', 
        'main',
        '.content',
        'body > div:first-child',
        'body'
    ];
    
    for (const selector of targetSelectors) {
        const container = document.querySelector(selector);
        if (container) {
            container.insertAdjacentHTML('afterbegin', statsHtml);
            break;
        }
    }
}

function getTotalQuestionCount() {
    let total = 0;
    Object.values(window.SUREADING_DATA.questions).forEach(questionSet => {
        if (questionSet.chapters) {
            Object.values(questionSet.chapters).forEach(chapter => {
                if (chapter.questions) {
                    total += chapter.questions.length;
                }
            });
        }
    });
    return total;
}

function initializeBooksAdmin() {
    console.log('📚 책 관리 시스템 초기화');
    displayAIBooksManagement();
}

function displayAIBooksManagement() {
    const data = window.SUREADING_DATA;
    if (!data) return;
    
    let booksHtml = `
        <div class="ai-books-section" style="margin: 20px 0;">
            <h3>🤖 AI 연동 도서 관리</h3>
            <p style="color: #666; margin-bottom: 15px;">
                AI가 생성한 ${getTotalQuestionCount()}개의 문제로 구성된 완전한 학습 시스템
            </p>
    `;
    
    Object.entries(data.books).forEach(([level, books]) => {
        books.forEach(book => {
            const questions = data.questions[book.id];
            const questionCount = questions ? Object.values(questions.chapters).reduce((total, chapter) => 
                total + (chapter.questions ? chapter.questions.length : 0), 0) : 0;
            
            booksHtml += `
                <div class="ai-book-card" style="
                    border: 2px solid #28a745;
                    border-radius: 10px;
                    padding: 15px;
                    margin: 10px 0;
                    background: white;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                ">
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <div style="
                            background: ${book.coverColor};
                            width: 50px;
                            height: 50px;
                            border-radius: 8px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 1.2rem;
                        ">${book.cover}</div>
                        
                        <div style="flex: 1;">
                            <h5 style="margin: 0 0 5px 0; color: #333;">${book.title}</h5>
                            <p style="margin: 0; color: #666; font-size: 0.9rem;">
                                <strong>저자:</strong> ${book.author} | 
                                <strong>레벨:</strong> ${level} | 
                                <strong>단어:</strong> ${book.words.toLocaleString()}개
                            </p>
                            <p style="margin: 5px 0 0 0; color: #888; font-size: 0.8rem;">
                                ${book.summary.substring(0, 80)}...
                            </p>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; gap: 5px;">
                            <span style="
                                background: ${questionCount > 0 ? '#28a745' : '#dc3545'};
                                color: white;
                                padding: 4px 8px;
                                border-radius: 4px;
                                font-size: 0.8rem;
                                text-align: center;
                            ">${questionCount}개 문제</span>
                            
                            <button onclick="viewBookQuestions('${book.id}')" style="
                                background: #17a2b8;
                                color: white;
                                border: none;
                                padding: 6px 12px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 0.8rem;
                            ">📝 문제 보기</button>
                            
                            <button onclick="startQuiz('${book.id}')" style="
                                background: #28a745;
                                color: white;
                                border: none;
                                padding: 6px 12px;
                                border-radius: 4px;
                                cursor: pointer;
                                font-size: 0.8rem;
                            ">🚀 테스트</button>
                        </div>
                    </div>
                </div>
            `;
        });
    });
    
    booksHtml += '</div>';
    
    // 페이지에 추가
    const targetSelectors = ['.books-section', '.main-content', '.container', 'body'];
    for (const selector of targetSelectors) {
        const container = document.querySelector(selector);
        if (container) {
            container.insertAdjacentHTML('beforeend', booksHtml);
            break;
        }
    }
}

function initializeDashboard() {
    console.log('📊 대시보드 초기화');
}

function initializeAnalytics() {
    console.log('📈 분석 시스템 초기화');
}

function initializeStudentsAdmin() {
    console.log('👥 학생 관리 초기화');
}

// 전역 함수들
window.viewBookQuestions = function(bookId) {
    const questions = window.SUREADING_DATA.questions[bookId];
    if (questions) {
        let questionsList = `📖 ${bookId} 문제 목록:\n\n`;
        Object.entries(questions.chapters).forEach(([chapterNum, chapter]) => {
            questionsList += `${chapter.chapterTitle}:\n`;
            if (chapter.questions) {
                chapter.questions.forEach((q, index) => {
                    questionsList += `  ${index + 1}. ${q.question.substring(0, 60)}...\n`;
                });
            }
            questionsList += '\n';
        });
        alert(questionsList);
    } else {
        alert('이 책에는 문제가 없습니다.');
    }
};

window.startQuiz = function(bookId) {
    window.open(`quiz.html?book=${bookId}`, '_blank');
};
