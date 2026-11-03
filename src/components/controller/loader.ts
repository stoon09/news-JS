import { ApiResponse, Callback, Endpoint, HttpMethod, HttpStatus, RequestOptions, RequestParams } from '../../types';

class Loader {
    constructor(
        private readonly baseLink: string,
        private readonly options: Readonly<RequestOptions>
    ) {}

    protected getResp<T extends ApiResponse>(
        { endpoint, options = {} }: RequestParams,
        callback: Callback<T> = (): void => {
            console.error('No callback for GET response');
        }
    ): void {
        this.load<T>(HttpMethod.Get, endpoint, callback, options);
    }

    private errorHandler(res: Response): Response {
        if (!res.ok) {
            if (res.status === HttpStatus.Unauthorized || res.status === HttpStatus.NotFound) {
                console.log(`Sorry, but there is ${res.status} error: ${res.statusText}`);
            }
            throw Error(res.statusText);
        }

        return res;
    }

    private makeUrl(options: RequestOptions, endpoint: Endpoint): string {
        const urlOptions: RequestOptions = { ...this.options, ...options };
        const params = new URLSearchParams();

        Object.entries(urlOptions).forEach(([key, value]) => {
            if (value !== undefined) {
                params.append(key, value);
            }
        });

        return `${this.baseLink}${endpoint}?${params.toString()}`;
    }

    private load<T extends ApiResponse>(
        method: HttpMethod,
        endpoint: Endpoint,
        callback: Callback<T>,
        options: RequestOptions = {}
    ): void {
        fetch(this.makeUrl(options, endpoint), { method })
            .then((res) => this.errorHandler(res))
            .then((res): Promise<T> => res.json())
            .then((data) => callback(data))
            .catch((err) => console.error(err));
    }
}

export default Loader;