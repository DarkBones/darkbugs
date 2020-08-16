{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "rails-app.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "rails-app.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "rails-app.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "rails-app.labels" -}}
helm.sh/chart: {{ include "rails-app.chart" . }}
{{ include "rails-app.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "rails-app.selectorLabels" -}}
app.kubernetes.io/name: {{ include "rails-app.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "rails-app.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "rails-app.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{- define "rails-app.secretName" -}}
{{- printf "%s" (include "rails-app.fullname" .) -}}
{{- end -}}

{{- define "rails-app.db.password" -}}
{{- if .Values.global.postgresql.postgresqlPassword }}
{{- .Values.global.postgresql.postgresqlPassword -}}
{{- else if .Values.postgresqlPassword -}}
{{- .Values.postgresqlPassword -}}
{{- else -}}
{{- randAlphaNum 10 -}}
{{- end -}}
{{- end -}}

{{- define "rails-app.db.username" -}}
{{- if .Values.global.postgresql.postgresqlUsername }}
{{- .Values.global.postgresql.postgresqlUsername -}}
{{- else if .Values.postgresqlUsername -}}
{{- .Values.postgresqlUsername -}}
{{- else -}}
postgres
{{- end -}}
{{- end -}}

{{- define "rails-app.db.host" -}}
{{- if .Values.global.postgresql.host }}
{{- $hostname := default "tcp-postgresql" .Values.global.postgresql.host -}}
{{ printf "%s-%s" .Release.Name $hostname | trunc 14 | trimSuffix "-" }}
{{- else -}}
postgres
{{- end -}}
{{- end -}}

{{- define "rails-app.master-key" -}}
{{- if .Values.rails.masterKey -}}
{{- .Values.rails.masterKey -}}
{{- else -}}
{{- randAlphaNum 32 -}}
{{- end -}}
{{- end -}}

{{- define "rails-app.secrets" -}}
- secret: true
{{- end -}}

{{- define "rails-app.app-name" -}}
{{ default "rails-app" .Values.appName }}
{{- end -}}
