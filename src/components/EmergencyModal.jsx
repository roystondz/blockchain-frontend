import React, { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";
import InputField from "./InputField";
import { Shield, AlertTriangle, Users, Clock, MapPin, AlertCircle, Activity } from "lucide-react";

const EmergencyModal = ({ isOpen, onClose, patient, onConfirm, loading = false }) => {
  const [reason, setReason] = useState("");

  if (!patient) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
            <AlertTriangle className="w-5 h-5 text-white" />
          </div>
          <span className="text-red-600 font-bold">🚨 EMERGENCY ACCESS REQUEST 🚨</span>
        </div>
      }
      size="lg"
      className="border-red-200"
    >
      <div className="space-y-6">
        {/* CRITICAL EMERGENCY BANNER */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl flex items-center gap-2">
                <Activity className="w-6 h-6 animate-pulse" />
                CRITICAL EMERGENCY ACCESS
              </h3>
              <p className="text-red-100 mt-1 font-medium">
                IMMEDIATE ACCESS REQUIRED - PATIENT LIFE AT RISK
              </p>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
          <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2">
            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            CRITICAL PATIENT DETAILS
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-3 border border-red-200">
              <p className="text-xs font-bold text-red-600 uppercase">Name</p>
              <p className="font-bold text-gray-900 text-lg">{patient.name}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-red-200">
              <p className="text-xs font-bold text-red-600 uppercase">Patient ID</p>
              <p className="font-mono font-bold text-gray-900">{patient.patientId}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-red-200">
              <p className="text-xs font-bold text-red-600 uppercase">Age</p>
              <p className="font-bold text-gray-900 text-lg">{patient.age} years</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-red-200">
              <p className="text-xs font-bold text-red-600 uppercase">Blood Type</p>
              <p className="font-bold text-red-600 text-lg">{patient.bloodGroup}</p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-red-200">
              <p className="text-xs font-bold text-red-600 uppercase">Location</p>
              <p className="font-bold text-gray-900 flex items-center gap-1">
                <MapPin className="w-4 h-4 text-red-600" />
                {patient.city}
              </p>
            </div>
            <div className="bg-white rounded-lg p-3 border border-red-200">
              <p className="text-xs font-bold text-red-600 uppercase">Request Time</p>
              <p className="font-bold text-gray-900 flex items-center gap-1">
                <Clock className="w-4 h-4 text-red-600" />
                {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>

        {/* Reason for Emergency Access */}
        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
          <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            EMERGENCY REASON - URGENT
          </h4>
          <InputField
            label="EXPLAIN THE MEDICAL EMERGENCY"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="CRITICAL: Describe the life-threatening situation... e.g., Cardiac arrest, Severe trauma, Unconscious patient, Respiratory failure"
            required
            multiline
            rows={4}
            className="border-orange-300 focus:border-orange-500"
          />
        </div>

        {/* CRITICAL WARNING */}
        <div className="bg-red-100 border-2 border-red-300 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center animate-pulse">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-red-800 text-lg">⚠️ CRITICAL WARNING ⚠️</h4>
              <ul className="text-sm font-bold text-red-700 mt-2 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  <span>This access will be permanently logged and monitored</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  <span>Access is temporary and for EMERGENCY CARE ONLY</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  <span>MISUSE WILL RESULT IN IMMEDIATE DISCIPLINARY ACTION</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-600">•</span>
                  <span>Admin approval is REQUIRED for full access</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* EMERGENCY ACTION BUTTONS */}
        <div className="flex gap-3 pt-4 border-t-2 border-red-200">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1 border-2 border-gray-300 hover:bg-gray-100"
          >
            <span className="font-medium">CANCEL REQUEST</span>
          </Button>
          <Button
            onClick={() => onConfirm(reason)}
            disabled={loading || !reason.trim()}
            loading={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 border-2 border-red-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                <span className="font-bold">SENDING EMERGENCY REQUEST...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-bold">🚨 SEND EMERGENCY ACCESS 🚨</span>
              </div>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EmergencyModal;
