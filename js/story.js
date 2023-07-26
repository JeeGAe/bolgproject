const scroller = new Scroller(false)// 스크롤 객체 생성

window.addEventListener('load', event => {
  //테마 변경 (다크/일반)
  const mode = document.querySelector('.mode');
  const header = document.querySelector('header');
  const icons = header.querySelectorAll('.fa-solid');
  const categoryContainer = document.querySelector('.category-container');
  
  mode.addEventListener('click', event => {
    document.body.classList.toggle('dark');
    header.classList.toggle('dark');
    categoryContainer.classList.toggle('dark');

    for(const icon of icons){
      icon.classList.contains('active') ?
        icon.classList.remove('active') :
        icon.classList.add('active');
    }
  })
  //브라우저 상단으로 스크롤
  const arrowUp = document.querySelector('.footer .icons .scroll-up');
  arrowUp.addEventListener('click', event => {
    history.pushState({}, "", "/"); //URL 초기화
    scroller.setScrollPosition({top: 0, behavior: 'smooth'});
    //scroller.isScrollEnded();
  })

  const logo = document.querySelector('header .logo');
  logo.addEventListener('click', event => {
    event.preventDefault(); //a 태그 기본동작 제거
    history.pushState({}, "", "/"); //URL 초기화
    scroller.setScrollPosition({top: 0, behavior: 'smooth'});
    scroller.isScrollEnded();
  })

  // 초기 로딩시 블로그 10개 추가
  const blogContainer = document.querySelector('.blog-container');
  blogContainer.innerHTML += getBlogList(10);

  window.addEventListener('scroll', event => {
    //무한 스크롤 기능 구현
    const scrollHeight = Math.max(   // 전체문서 높이 (스크롤이벤트 내부에 있어야 함)
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
    );

    if(Math.abs(scroller.getScrollPosition() + document.documentElement.clientHeight - scrollHeight) < 100){
      blogContainer.innerHTML += getBlogList(10);
    }
  })
})

//더미 데이터 생성
function getBlogList(num){
  let blogList = '';
  for(let i = 0; i < num; i++){
    blogList += `
    <div class="blog">
      <div class="left">
        <ul>
          <li class="category-name"><a href="#">여행</a></li>
          <li class="posting-time">1시간 전</li>
          <li><a href="#" class="likes">공감</a><span>9</span></li>
        </ul>
      </div>
      <div class="middle">
        <ul>
          <li><h3>제주도 오른 까페 방문하기</h3></li>
          <li><p>성산의 해안도로를 따라 달리다 보면 보이는 오른 카페는 제주도의 자연요소 중 하나인 오름을 모티브로 한 카페의 콘셉트인 만큼 자연과 함께 커피를 마시며 즐길 수 있었던 것 같아요.😋</p></li>
          <li>
            <ul>
              <li>
                <div class="account">
                  <img src="../imgs/avatar.jpg" alt="">
                  촌부 <span>by 농돌이</span>
                </div>
              </li>
              <li>
                <button>구독하기</button>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="right">
        <ul>
          <li>
            <img src="../imgs/waterfall.jpg" alt="blog-thumnail">
          </li>
        </ul>
      </div>
    </div>
    `
  }
  return blogList;
}