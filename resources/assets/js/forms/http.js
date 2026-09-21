module.exports = {
    /**
     * Helper method for making POST HTTP requests.
     */
    post(uri, form) {
        return Spark.sendForm('post', uri, form);
    },

    postWithFiles(uri, form) {
        return Spark.sendFormNew('post', uri, form);
    },


    /**
     * Helper method for making PUT HTTP requests.
     */
    put(uri, form) {
        return Spark.sendForm('put', uri, form);
    },


    /**
     * Helper method for making PATCH HTTP requests.
     */
    patch(uri, form) {
        return Spark.sendForm('patch', uri, form);
    },


    /**
     * Helper method for making DELETE HTTP requests.
     */
    delete(uri, form) {
        return Spark.sendForm('delete', uri, form);
    },


    /**
     * Send the form to the back-end server.
     *
     * This function will clear old errors, update "busy" status, etc.
     */
    sendForm(method, uri, form) {
        return new Promise((resolve, reject) => {
            form.startProcessing();

            axios[method](uri, JSON.parse(JSON.stringify(form)))
                .then(response => {
                    form.finishProcessing();

                    resolve(response.data);
                })
                .catch(errors => {
                    form.setErrors(errors.response.data.errors);

                    reject(errors.response.data);
                });
        });
    },

    sendFormNew(method, uri, form) {
        return new Promise((resolve, reject) => {
            form.startProcessing();

            axios[method](uri, Spark.convertToFormData(form))
                .then(response => {
                    form.finishProcessing();

                    resolve(response.data);
                })
                .catch(errors => {
                    form.setErrors(errors.response.data.errors);

                    reject(errors.response.data);
                });
        });
    },

    convertToFormData(obj) {
        const formData = new FormData();

	const ignoreKeys = ["errors","busy","successful","startProcessing","finishProcessing","reset","resetStatus","setErrors"];

        function appendFormData(data, parentKey = '') {
            if (data === null || data === undefined) {
                return;
            }

	    if (ignoreKeys.includes(parentKey))
		return;

            if (Array.isArray(data)) {
                data.forEach((item, index) => {
                    const key = parentKey ? `${parentKey}[${index}]` : index.toString();
                    appendFormData(item, key);
                });
            } else if (typeof data === 'object' && !(data instanceof File) && !(data instanceof Blob)) {
                Object.keys(data).forEach(key => {
                    const value = data[key];
                    const fullKey = parentKey ? `${parentKey}[${key}]` : key;
                    appendFormData(value, fullKey);
                });
            } else {
                // Primitive value, File, Blob, etc.
                formData.append(parentKey, data);
            }
        }

        appendFormData(obj);
        return formData;
    },
};
