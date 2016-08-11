/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2016-08-09
 */
import angular from 'angular';
import { Inject } from 'angular-es-utils/decorators';
import injector from 'angular-es-utils/injector';

import ModalService from '../ModalService';
import bodyTplUrl from './modal-body.url.html';
import footerTplUrl from './modal-footer.url.html';

import { assert } from 'chai';

describe('ModalService', () => {

	const getModalScope = () => angular.element(document.querySelector('.ccms-modal .modal')).scope();
	const getConfirmScope = () => angular.element(document.querySelector('.ccms-modal .confirm')).scope();
	let options;

	beforeEach(() => {

		const scope = injector.get('$rootScope').$new();

		@Inject('data', 'modalInstance')
		class Controller {

			constructor() {
				this.userName = 'kuitos';
				this.age = 20;
			}

			$onInit() {
				this.age++;
			}

			ok() {
				const {userName, age, gender} = this;
				this._modalInstance.ok(`${userName} ${age} ${gender}`);
			}

			cancel() {
				this._modalInstance.cancel(this.age);
			}
		}

		options = {
			title: 'modal',
			scope: scope,
			body: bodyTplUrl,
			uid: 'km',
			style: {
				width: '700px'
			},
			fullscreen: true,
			hasFooter: false,
			locals: {
				data: [1, 2, 3]
			},
			controller: Controller,
			bindings: {
				gender: 'not quite clear'
			}
		};
	});

	afterEach(() => {
		[...document.querySelectorAll('.ccms-modal')].forEach(element => document.body.removeChild(element));
	});

	describe('modal method', () => {

		it('basic props should be init well', done => {
			const modalInstance = ModalService.modal(options).open();
			modalInstance._renderDeferred.promise.then(() => {

				const modalScope = getModalScope();
				assert.equal(modalScope.$parent, options.scope);
				assert.equal(modalScope.title, options.title);
				assert.equal(modalScope.style, options.style);

				modalScope.$$postDigest(() => {
					assert.equal(document.querySelector('.ccms-modal'), document.querySelector('[data-uid="km"]'));
					assert.isFalse(document.querySelector('.ccms-modal').contains(document.querySelector('footer')));
					done();
				});
			});
		});

		it('scope should be equal to $rootScope when not configured', done => {
			options.scope = null;
			const modalInstance = ModalService.modal(options).open();
			modalInstance._renderDeferred.promise.then(() => {
				const modalScope = getModalScope();
				assert.equal(modalScope.$parent, injector.get('$rootScope'));
				done();
			});
		});

		it('modal on ok close', done => {

			const modalInstance = ModalService.modal(options).open();
			modalInstance._renderDeferred.promise.then(() => {

				const modalScope = getModalScope();
				modalScope.$ok();

				modalInstance.result.then(data => {
					assert.equal(data, 'kuitos 21 not quite clear');
					done();
				});
			});

		});

		it('modal on cancel close', done => {
			const modalInstance = ModalService.modal(options).open();
			modalInstance._renderDeferred.promise.then(() => {

				const modalScope = getModalScope();
				modalScope.$cancel();

				modalInstance.result.then(angular.noop,
					data => {
						assert.strictEqual(data, 21);
						done();
					});
			});
		});

		it('modal with custom footer template', done => {
			options.hasFooter = true;
			options.footer = footerTplUrl;
			const modalInstance = ModalService.modal(options).open();
			modalInstance._renderDeferred.promise.then(() => {

				const modalScope = getModalScope();

				modalScope.$$postDigest(() => {
					assert.strictEqual(document.querySelector('.ccms-modal footer div').childElementCount, 3);
					done();
				});
			});
		});

	});

	describe('confirm method', () => {

		it('message should be perform well', done => {
			let count = 0;
			const message = 'wo shi da shuai <b>bi!</b>';
			const confirmInstance = ModalService.confirm(message, () => count++).open();
			confirmInstance._renderDeferred.promise.then(() => {

				const scope = getConfirmScope();
				assert.equal(scope.message, message);
				scope.$close();
				assert.strictEqual(count, 1);
				done();
			});
		});

	});

});
