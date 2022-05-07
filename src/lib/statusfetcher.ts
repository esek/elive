import DefaultColors from '$/constants/colors';
import type { FullService, ServiceWithStatus, StrippedService } from '$/models/ServiceResponse';
import type { RequestHeader, ServiceButtonOptions } from '@prisma/client';
import axios, { type AxiosInstance } from 'axios';
import jp from 'jsonpath';

type BasedOnStatus = {
	success: string | null;
	error: string | null;
};

type Overrides = {
	colors: BasedOnStatus;
	messages: BasedOnStatus;
};

class StatusFetcher {
	private readonly service: StrippedService;
	private readonly button: Partial<ServiceButtonOptions>;
	private readonly parser: string | null = null;

	private successful: boolean = false;
	private response: string = 'Success';

	// private readonly service: Service & { label: string; url: string };

	// private readonly type: ServiceStatusType;

	// private readonly overrides: Overrides;
	private readonly axiosInstance: AxiosInstance;

	// private statusMessage: string = 'Failed';

	constructor(service: FullService, useParsers: boolean) {
		const { headers, button, ...stripped } = service;
		this.service = stripped;
		this.button = button ?? {};

		this.axiosInstance = this.createAxiosInstance(service.statusUrl, service.method, headers);

		// if we want to use parsers, set the parser
		if (useParsers) {
			this.parser = service.parser;
		}
	}

	public static fromServicesArray(statuses: FullService[], useParsers: boolean): StatusFetcher[] {
		return statuses.map((s) => new StatusFetcher(s, useParsers));
	}

	/**
	 * Creates an axios instance with the given url and method
	 * sets the headers if they are given
	 * @param url the url to fetch the status from
	 * @param method the method to use
	 * @param headers any headers that need to be set
	 * @returns an axiosinstance
	 */
	private createAxiosInstance = (url: string, method: string, headers?: RequestHeader[]) => {
		return axios.create({
			method,
			baseURL: url,
			headers: this.parseHeaders(headers)
		});
	};

	private parseHeaders = (headers?: RequestHeader[]): Record<string, string> => {
		if (!headers?.length) {
			return {};
		}

		return headers.reduce(
			(acc, header) => ({
				...acc,
				[header.key]: header.value
			}),
			{}
		);
	};

	public fetch = async (): Promise<void> => {
		const { service } = this;

		try {
			const status = await this.axiosInstance.get('');
			const response = status.data;

			// indicate that the request was successful
			this.successful = true;

			// if we have an override, use that
			if (service.successOverride) {
				this.response = service.successOverride;
				return;
			}

			// if we don't have a parser, return the entire response
			if (!this.parser) {
				this.response = 'Success';
				return;
			}

			// if we do have a parser, use it
			this.response = this.getParsedValue(response);

			return;
		} catch (err) {
			// if we have an override, use that
			if (service.errorOverride) {
				this.response = service.errorOverride;
			}
		}
	};

	private getParsedValue = (response: unknown): string => {
		// if there is no parser, just return the response again
		if (this.parser === null) {
			return `${response}`;
		}

		// else we check how we want to parse it
		switch (this.service.type) {
			case 'JSON':
			case 'YAML':
				return this.parseJson(response, this.parser);
		}

		return 'Failed';
	};

	/**
	 * Parses a json string and returns the value that is specified in the parser
	 * @param json  the json string to parse
	 * @param parser a jsonpath string to use
	 * @returns the value that is specified in the parser
	 */
	private parseJson = (json: unknown, parser: string) => {
		if (typeof json !== 'object') {
			return `${json}`;
		}

		const parsed = jp.query(json, parser);

		if (!parsed?.length) {
			this.successful = false;
			return 'JSON parsing failed';
		}

		return parsed.join(', ');
	};
	/**
	 * Converts the status to a json object
	 * @returns a json object
	 */
	public toJson = (): ServiceWithStatus => {
		return {
			service: this.service,
			status: {
				label: this.button.label ?? this.service.name,
				color: this.getColor(),
				message: this.response,
				success: this.successful
			}
		};
	};

	/**
	 * Helper to get a color based on the status
	 * @returns a string of the color
	 */
	private getColor = () => {
		if (!this.successful) {
			return this.button.errorColor ?? DefaultColors.error;
		}

		return this.button.successColor ?? DefaultColors.success;
	};
}

export default StatusFetcher;
