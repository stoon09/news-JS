import './news.css';
import { Article } from '../../../types';
import { getElement } from '../../../utils/dom';

const MAX_NEWS_COUNT = 10;
const PLACEHOLDER_IMAGE = 'img/news_placeholder.jpg';

class News {
    public draw(data: readonly Article[]): void {
        const news = data.slice(0, MAX_NEWS_COUNT);

        const fragment = document.createDocumentFragment();
        const newsItemTemp = getElement<HTMLTemplateElement>('#newsItemTemp');

        news.forEach((item, idx) => {
            const newsClone = newsItemTemp.content.cloneNode(true) as DocumentFragment;

            if (idx % 2) getElement<HTMLElement>('.news__item', newsClone).classList.add('alt');

            getElement<HTMLElement>('.news__meta-photo', newsClone).style.backgroundImage = `url(${
                item.urlToImage || PLACEHOLDER_IMAGE
            })`;
            getElement<HTMLElement>('.news__meta-author', newsClone).textContent = item.author || item.source.name;
            getElement<HTMLElement>('.news__meta-date', newsClone).textContent = item.publishedAt
                .slice(0, 10)
                .split('-')
                .reverse()
                .join('-');

            getElement<HTMLElement>('.news__description-title', newsClone).textContent = item.title;
            getElement<HTMLElement>('.news__description-source', newsClone).textContent = item.source.name;
            getElement<HTMLElement>('.news__description-content', newsClone).textContent = item.description;
            getElement<HTMLElement>('.news__read-more a', newsClone).setAttribute('href', item.url);

            fragment.append(newsClone);
        });

        const container = getElement<HTMLElement>('.news');
        container.innerHTML = '';
        container.appendChild(fragment);
    }
}

export default News;