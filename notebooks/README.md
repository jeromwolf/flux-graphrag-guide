# GraphRAG 실습 노트북

커리큘럼 7개 Part에 대응하는 실습 노트북입니다. 이론으로 배운 내용을 직접 코드로 실행하며 체득합니다.

## 사전 준비

| 항목 | 요구사항 |
|------|----------|
| Python | 3.12 이상 |
| Docker | Docker Desktop 또는 Docker Engine |
| OpenAI API 키 | [platform.openai.com](https://platform.openai.com)에서 발급 |

## Neo4j 설치 (Docker Compose)

프로젝트 루트에 `docker-compose.yml`을 생성합니다.

```yaml
services:
  neo4j:
    image: neo4j:5-community
    ports:
      - "7474:7474"
      - "7687:7687"
    environment:
      NEO4J_AUTH: neo4j/graphrag2024
      NEO4J_PLUGINS: '["apoc"]'
    volumes:
      - neo4j_data:/data
volumes:
  neo4j_data:
```

## 설치 방법

```bash
# 1. 가상환경 생성
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate

# 2. 패키지 설치
pip install -r requirements.txt

# 3. 환경변수 설정
cp .env.example .env
# .env 파일을 열어 API 키와 Neo4j 비밀번호를 입력하세요

# 4. Neo4j 실행
docker compose up -d

# 5. Neo4j 브라우저 확인
# http://localhost:7474 접속 후 neo4j / graphrag2024 로 로그인
```

## 노트북 목록

| 번호 | 노트북 | 커리큘럼 | 소요시간 |
|------|--------|----------|----------|
| 01 | `01_why_graphrag.ipynb` | Part 1 - 왜 GraphRAG인가? | 2시간 |
| 02 | `02_manual_kg.ipynb` | Part 2 - 수작업 KG | 2시간 |
| 03 | `03_llm_extraction.ipynb` | Part 3 - LLM 자동화 | 2시간 |
| 04 | `04_entity_resolution.ipynb` | Part 4 - Entity Resolution | 1시간 |
| 05 | `05_multimodal_vlm.ipynb` | Part 5 - 멀티모달 VLM | 2시간 |
| 06 | `06_search_pipeline.ipynb` | Part 6 - 통합 + 검색 | 1.5시간 |
| 07 | `07_production_guide.ipynb` | Part 7 - 실무 적용 가이드 | 1시간 |

## 실행

```bash
jupyter notebook
```

브라우저에서 `01_why_graphrag.ipynb`부터 순서대로 진행하세요.

## 데이터 파일

`data/` 디렉토리에 실습용 데이터가 준비되어 있습니다.

| 파일 | 용도 |
|------|------|
| `news_articles.json` | IT 뉴스 기사 10건 (엔티티 추출 실습) |
| `manufacturing_docs.json` | 제조 도메인 문서 5건 (브레이크패드 생산) |
| `eval_questions.json` | 평가 질문 30건 (RAGAS 평가용) |
