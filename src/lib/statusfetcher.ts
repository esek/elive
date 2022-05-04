import DefaultColors from '$/constants/colors';
import type { Service, ServiceStatusType, StatusHeader } from '@prisma/client';
import axios, { type AxiosInstance } from 'axios';
import jp from 'jsonpath';
import type { ServiceWithStatus } from './prisma';

type Response =
	| {
			[key: string]: any;
	  }
	| string;

type BasedOnStatus = {
	success: string | null;
	error: string | null;
};

class StatusFetcher {
	private readonly service: Service;
	private readonly type: ServiceStatusType;
	private readonly parser: string | null = null;
	private readonly overrides: BasedOnStatus;
	private readonly colors: BasedOnStatus;
	private readonly axiosInstance: AxiosInstance;

	private statusMessage: string = 'Failed';
	private successful: boolean = false;

	constructor(service: ServiceWithStatus, useParsers: boolean) {
		const { status, ...rest } = service;

		this.service = rest;

		this.axiosInstance = this.createAxiosInstance(status.statusUrl, status.method, status.headers);

		this.type = status.type;
		this.overrides = {
			success: status.successString,
			error: status.errorString
		};
		this.colors = {
			success: status.successColor,
			error: status.errorColor
		};

		if (useParsers) {
			this.parser = status.parser;
		}
	}

	public static fromServicesArray(
		statuses: ServiceWithStatus[],
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
			if (this.overrides.success) {
				this.statusMessage = this.overrides.success;
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
		} catch {
			// if we have an override, use that
			if (this.overrides.error) {
				this.statusMessage = this.overrides.error;
			}

			return this;
		}
	};

	private getParsedValue = (response: string): string => {
		// if there is no parser, just return the response again
		if (this.parser === null) {
			return response;
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
	private parseJson = (json: Response, parser: string) => {
		if (typeof json !== 'object') {
			return json;
		}

		const parsed = jp.query(json, parser);

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
		// check if we have any data
		if (!this.successful) {
			return this.overrideOrDefaultColor('error');
		}

		return this.overrideOrDefaultColor('success');
	};

	/**
	 * Returns either the set overridecolor or the default
	 * @param key the key indicating the status
	 * @returns the color
	 */
	private overrideOrDefaultColor = (key: keyof BasedOnStatus) => {
		return this.overrides[key] ?? DefaultColors[key];
	};
}

export default StatusFetcher;
