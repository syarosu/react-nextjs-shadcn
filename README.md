# React Next.js Shadcn 프로젝트

이 프로젝트는 https://jsonplaceholder.typicode.com 에서 제공한 API를 사용해서 API 호출 모듈화 하여 React와 Next.js를 기반으로 Shadcn UI를 사용한 게시판 입니다.

* API 경로는 'env.local' 파일에서 환경변수로 수정 가능합니다.

![image](https://github.com/user-attachments/assets/2bafe202-1f8e-4d8d-aa28-f5e4d89ab53c)


## 기술 스택

* **React**
* **Next.js**
* **TypeScript**
* **Tailwind CSS**
* **Shadcn UI**

## 프로젝트 구조

```bash
.
├── app
│   ├── page.tsx (기본 페이지 정의)
├── components ( UI 컴포넌트)
├── lib ( 유틸리티 및 라이브러리 코드)
├── public (정적 파일 관리)
└── styles (전역 스타일 및 Tailwind 구성)
```

## 설치 및 실행 방법

1. 저장소를 클론합니다.

```bash
git clone https://github.com/syarosu/react-nextjs-shadcn.git
```

2. 프로젝트 디렉터리로 이동 후, 의존성을 설치합니다.

```bash
cd react-nextjs-shadcn
npm install
# 또는 yarn install
```

3. 로컬 서버를 실행합니다.

```bash
npm run dev
# 또는 yarn dev
```

4. 브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 확인합니다.


이 프로젝트에 기여하고 싶다면, Fork 후 Pull Request를 보내주세요. 이슈나 기능 개선 사항은 Issue 탭을 통해 자유롭게 제안해 주시면 감사하겠습니다.

