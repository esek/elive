import DefaultColors from '$/constants/colors';
import type { ServiceResponse } from '$/models/ServiceResponse';
import type { Service, ServiceStatusType, StatusHeader } from '@prisma/client';
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
	private readonly service: Service & { label: string; url: string };

	private readonly type: ServiceStatusType;
	private readonly parser: string | null = null;

	private readonly overrides: Overrides;
	private readonly axiosInstance: AxiosInstance;

	private statusMessage: string = 'Failed';
	private successful: boolean = false;

	constructor(service: ServiceResponse, useParsers: boolean) {
		const { status, ...rest } = service;

		this.service = { ...rest, label: status.label, url: status.statusUrl };

		this.axiosInstance = this.createAxiosInstance(status.statusUrl, status.method, status.headers);

		this.type = status.type;

		this.overrides = {
			colors: {
				success: status.successColor ?? DefaultColors.success,
				error: status.errorColor ?? DefaultColors.error
			},
			messages: {
				success: status.successString,
				error: status.errorString
			}
		};

		if (useParsers) {
			this.parser = status.parser;
		}
	}

	public static fromServicesArray(
		statuses: ServiceResponse[],
		useParsers: boolean
	): StatusFetcher[] {
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
	private createAxiosInstance = (url: string, method: string, headers?: StatusHeader[]) => {
		return axios.create({
			method,
			baseURL: url,
			headers: this.parseHeaders(headers)
		});
	};

	private parseHeaders = (headers?: StatusHeader[]): Record<string, string> => {
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

	public fetch = async (): Promise<StatusFetcher> => {
		try {
			const status = await this.axiosInstance.get('');
			const response = status.data;

			// indicate that the request was successful
			this.successful = true;

			// if we have an override, use that
			if (this.overrides.messages.success) {
				this.statusMessage = this.overrides.messages.success;
				return this;
			}

			// if we don't have a parser, return the entire response
			if (!this.parser) {
				this.statusMessage = 'Success';
				return this;
			}

			// if we do have a parser, use it
			this.statusMessage = this.getParsedValue(response);
			return this;
		} catch (err) {
			// if we have an override, use that
			if (this.overrides.messages.error) {
				this.statusMessage = this.overrides.messages.error;
			}

			return this;
		}
	};

	private getParsedValue = (response: unknown): string => {
		// if there is no parser, just return the response again
		if (this.parser === null) {
			return `${response}`;
		}

		// else we check how we want to parse it
		switch (this.type) {
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
	public toJson = () => {
		return {
			...this.service,
			status: {
				success: this.successful,
				data: this.statusMessage,
				color: this.getColor()
			}
		};
	};

	/**
	 * Helper to get a color based on the status
	 * @returns a string of the color
	 */
	private getColor = () => {
		return !this.successful ? this.overrides.colors.error : this.overrides.colors.success;
	};
}

export default StatusFetcher;
