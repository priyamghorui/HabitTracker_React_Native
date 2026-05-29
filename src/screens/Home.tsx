import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Plus,
  Minus,
  Check,
  Trash2,
  Edit3,
  BarChart3,
  Calendar,
  Clock,
  X,
  ChevronRight,
  History,
  CalendarCheck2,
  Medal,
  PartyPopper,
  AlertCircle,
  Info,
} from 'lucide-react-native';

import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  addHabit,
  editHabit,
  removeHabit,
  toggleCompleteHabits,
} from '../redux/action/action';
import LoadTodos from '../components/home/LoadHabit';
import LoadHabit from '../components/home/LoadHabit';
export default function HabitTrackerScreen() {
  const habitsRedux = useSelector(state => state.habitReducer);
  const loadReducer = useSelector(state => state.loadReducer);
  const navigation = useNavigation();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isStatsModalVisible, setIsStatsModalVisible] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');
  const [targetDays, setTargetDays] = useState(7);
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [selectedHabitForStats, setSelectedHabitForStats] = useState(null);

  const [currentDateTime, setCurrentDateTime] = useState('');
  const inputRef = useRef<TextInput>(null);

  const dispatch = useDispatch();
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
      setCurrentDateTime(now.toLocaleDateString('en-US', options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, [isAddModalVisible]);

  const handleOpenAddModal = () => {
    setEditingHabitId(null);
    setNewHabitName('');
    setTargetDays(7);
    setIsAddModalVisible(true);
  };

  const handleOpenEditModal = habit => {
    setEditingHabitId(habit.id);
    setNewHabitName(habit.name);
    setTargetDays(habit.targetDays);
    setIsAddModalVisible(true);
  };

  const handleSaveHabit = () => {
    if (!newHabitName.trim()) return;

    if (editingHabitId) {
      dispatch(
        editHabit({
          id: editingHabitId,
          name: newHabitName.trim(),
          targetDays: targetDays,
        }),
      );
    } else {
      const newHabit = {
        id: Date.now().toString(),
        name: newHabitName.trim(),
        completedDays: 0,
        targetDays: targetDays,
        isCompletedToday: false,
        status: true,
        habitsLog: [],
        createdAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
        updatedAt: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      };
      dispatch(addHabit(newHabit));
    }
    setIsAddModalVisible(false);
    setNewHabitName('');
  };

  const toggleCompleteHabit = habit => {
    console.log('>>');
    if (!habit.isCompletedToday) {
      Alert.alert(
        'Complete Habit',
        `Are you sure you want to mark "${habit.name}" as completed for today?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes, Done!',
            onPress: () => {
              dispatch(
                toggleCompleteHabits({
                  id: habit.id,
                  habitAll: habit,
                  makeAdd: true,
                }),
              );
            },
          },
        ],
      );
    } else {
      dispatch(
        toggleCompleteHabits({ id: habit.id, habitAll: habit, makeAdd: false }),
      );
    }
  };

  const handleDeleteHabit = (id: string, name: string) => {
    Alert.alert(
      'Delete Habit',
      `Are you sure you want to permanently delete "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            dispatch(removeHabit(id));
          },
        },
      ],
    );
  };

  const handleOpenStats = habit => {
    setSelectedHabitForStats(habit);
    setIsStatsModalVisible(true);
  };

  const handleGoToHistoryScreen = () => {
    console.log(selectedHabitForStats);

    setIsStatsModalVisible(false);

    navigation.navigate('History', { data: selectedHabitForStats });
  };

  const renderHabitItem = ({ item }) => {
    const isGoalAchieved = item.completedDays >= item.targetDays;
    const isCompletedToday = item.isCompletedToday;
    const isSkipped = item.status === false && !isGoalAchieved;

    const accentColor = isGoalAchieved ? '#F59E0B' : '#A5B4FC';

    const handleShowResetInfo = () => {
      Alert.alert(
        'Streak Notice',
        `You missed the previous logging window for "${item.name}". Your active streak counter has adjusted, but you can continue tracking today's progress normally!`,
        [{ text: 'Continue Process', style: 'default' }],
      );
    };

    return (
      <View
        style={[
          styles.habitCard,
          isCompletedToday && styles.habitCardCompleted,
          isGoalAchieved && styles.habitCardAchieved,
        ]}
      >
        <TouchableOpacity
          onPress={() => toggleCompleteHabit(item)}
          disabled={isGoalAchieved}
          activeOpacity={0.8}
        >
          <View style={styles.habitMainRow}>
            <TouchableOpacity
              style={[
                styles.checkbox,
                isCompletedToday && styles.checkboxChecked,
                isGoalAchieved && styles.checkboxAchieved,
              ]}
              onPress={() => toggleCompleteHabit(item)}
              disabled={isGoalAchieved}
            >
              {isCompletedToday && (
                <Check color="#FFF" size={16} strokeWidth={3} />
              )}
            </TouchableOpacity>

            {/* Text Container */}
            <View style={styles.habitTextContainer}>
              <View style={styles.habitTitleHeaderRow}>
                <Text
                  style={[
                    styles.habitName,
                    isCompletedToday && styles.habitNameCompleted,
                    isGoalAchieved && styles.habitNameAchieved,
                  ]}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>

                {/* Premium Info Trigger for Missed Days */}
                {isSkipped && (
                  <TouchableOpacity
                    style={styles.infoIconButton}
                    onPress={handleShowResetInfo}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <Info color="#94A3B8" size={16} />
                  </TouchableOpacity>
                )}
              </View>

              {isGoalAchieved && (
                <View style={styles.achievementBadgeRow}>
                  <Medal
                    color={accentColor}
                    size={16}
                    style={styles.inlineIcon}
                  />
                  <Text style={styles.achievementText}>Hurray!</Text>
                  <PartyPopper
                    color={accentColor}
                    size={16}
                    style={styles.inlineIcon}
                  />
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>

        {/* Action / Metrics Row */}
        <View style={styles.actionBar}>
          <View
            style={[
              styles.streakBadge,
              isGoalAchieved && styles.streakBadgeAchieved,
            ]}
          >
            <CalendarCheck2 color={accentColor} size={15} />
            <Text
              style={[
                styles.streakText,
                isGoalAchieved && styles.streakTextAchieved,
              ]}
            >
              {item.completedDays}/{item.targetDays} days
            </Text>
          </View>

          <View style={styles.actionButtonsGroup}>
            <TouchableOpacity
              style={styles.iconActionButton}
              onPress={() => handleOpenStats(item)}
              accessibilityLabel="View metrics"
            >
              <BarChart3 color="#94A3B8" size={18} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconActionButton}
              onPress={() => handleOpenEditModal(item)}
              accessibilityLabel="Edit habit"
            >
              <Edit3 color="#94A3B8" size={18} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconActionButton}
              onPress={() => handleDeleteHabit(item.id, item.name)}
              accessibilityLabel="Delete habit"
            >
              <Trash2 color="#F43F5E" size={18} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const daysLeft = selectedHabitForStats
    ? Math.max(
        0,
        selectedHabitForStats.targetDays - selectedHabitForStats.completedDays,
      )
    : 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* --- HEADER --- */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerSubtitle}>TRACK YOUR JOURNEY</Text>
          <Text style={styles.headerTitle}>Routine.</Text>
        </View>

        <TouchableOpacity style={styles.historyTopButton} activeOpacity={0.7}>
          {/* <History color="#A5B4FC" size={18} style={{ marginRight: 6 }} /> */}
          {/* <Text style={styles.historyTopButtonText}>History</Text> */}
          <Text style={styles.historyTopButtonText}>v 1.0</Text>
        </TouchableOpacity>
      </View>

      {/* --- HABITS LIST --- */}
      {loadReducer ? (
        <LoadHabit />
      ) : (
        <FlatList
          data={habitsRedux}
          renderItem={renderHabitItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No habits tracked for today.</Text>
              <Text style={styles.emptySubtext}>
                Tap the button below to build consistency.
              </Text>
            </View>
          }
        />
      )}

      {/* --- FLOATING ADD BUTTON --- */}
      <TouchableOpacity
        style={styles.floatingAddButton}
        activeOpacity={0.8}
        onPress={handleOpenAddModal}
      >
        <Plus color="#FFF" size={28} strokeWidth={2.5} />
      </TouchableOpacity>

      {/* --- ADD / EDIT HABIT MODAL --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddModalVisible}
        onShow={() => inputRef.current?.focus()}
        onRequestClose={() => setIsAddModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheetContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingHabitId ? 'Refine Habit' : 'New Initiative'}
              </Text>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={() => setIsAddModalVisible(false)}
              >
                <X color="#64748B" size={20} />
              </TouchableOpacity>
            </View>

            <View style={styles.dateTimeRow}>
              <View style={styles.tag}>
                <Calendar
                  color="#6366F1"
                  size={14}
                  style={{ marginRight: 4 }}
                />
                <Text style={styles.tagText}>
                  {currentDateTime.split(',')[0] || ''}
                </Text>
              </View>
              <View style={styles.tag}>
                <Clock color="#6366F1" size={14} style={{ marginRight: 4 }} />
                <Text style={styles.tagText}>
                  {currentDateTime.split(',')[1] || ''}
                </Text>
              </View>
            </View>

            <TextInput
              ref={inputRef}
              style={styles.textInput}
              placeholder="What target you want to achive?"
              placeholderTextColor="#475569"
              value={newHabitName}
              onChangeText={setNewHabitName}
              maxLength={60}
            />

            {/* Target Setup Row */}
            <Text style={styles.settingLabelText}>
              Target Timeline Duration
            </Text>
            <View style={styles.targetControlContainer}>
              <TouchableOpacity
                style={styles.controlCounterButton}
                onPress={() => setTargetDays(prev => Math.max(1, prev - 1))}
              >
                <Minus color="#FFF" size={16} strokeWidth={2.5} />
              </TouchableOpacity>

              <View style={styles.counterValueDisplay}>
                <Text style={styles.counterValueNumber}>{targetDays}</Text>
                <Text style={styles.counterValueLabel}>Days</Text>
              </View>

              <TouchableOpacity
                style={styles.controlCounterButton}
                onPress={() => setTargetDays(prev => Math.min(365, prev + 1))}
              >
                <Plus color="#FFF" size={16} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.saveButton,
                !newHabitName.trim() && styles.saveButtonDisabled,
              ]}
              activeOpacity={0.8}
              onPress={handleSaveHabit}
              disabled={!newHabitName.trim()}
            >
              <Text style={styles.saveButtonText}>Save Habit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isStatsModalVisible}
        onRequestClose={() => setIsStatsModalVisible(false)}
      >
        <View style={styles.modalOverlayCenter}>
          <View style={styles.centerModalContainer}>
            <Text style={styles.statsSubtitle}>INSIGHTS</Text>
            <Text style={styles.statsTitle} numberOfLines={1}>
              {selectedHabitForStats?.name}
            </Text>

            <View style={styles.statsDivider} />

            {/* --- DYNAMIC METRIC DISK / CELEBRATION CARD --- */}
            {selectedHabitForStats &&
            selectedHabitForStats.completedDays >=
              selectedHabitForStats.targetDays ? (
              <View
                style={[styles.circularDiskOuter, styles.circularDiskAchieved]}
              >
                <View
                  style={[
                    styles.circularDiskInner,
                    styles.circularDiskInnerAchieved,
                  ]}
                >
                  <View style={styles.modalIconRow}>
                    <Medal
                      color="#F59E0B"
                      size={24}
                      style={{ marginRight: 4 }}
                    />
                    <PartyPopper color="#F59E0B" size={24} />
                  </View>
                  <Text style={styles.diskMetricsMainAchieved}>Hurray!</Text>
                  <Text style={styles.diskMetricsSubAchieved}>
                    Goal Completed
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.circularDiskOuter}>
                <View style={styles.circularDiskInner}>
                  <Text style={styles.diskMetricsMain}>{daysLeft}</Text>
                  <Text style={styles.diskMetricsSub}>Days Needed</Text>
                </View>
              </View>
            )}

            {/* Grid Stats Deck */}
            <View style={styles.statsInlineOverviewRow}>
              <View style={styles.subMiniStatCard}>
                <Text style={styles.subMiniStatVal}>
                  {selectedHabitForStats?.completedDays}
                </Text>
                <Text style={styles.subMiniStatLbl}>Completed</Text>
              </View>
              <View
                style={[
                  styles.subMiniStatCard,
                  { borderLeftWidth: 1, borderColor: '#1E293B' },
                ]}
              >
                <Text style={styles.subMiniStatVal}>
                  {selectedHabitForStats?.targetDays}
                </Text>
                <Text style={styles.subMiniStatLbl}>Target Goal</Text>
              </View>
            </View>

            <Text style={styles.metaText}>
              Tracking initiated on {selectedHabitForStats?.createdAt}
            </Text>

            <TouchableOpacity
              style={styles.historyLinkButton}
              activeOpacity={0.7}
              onPress={handleGoToHistoryScreen}
            >
              <Text style={styles.historyLinkText}>
                View Comprehensive History
              </Text>
              <ChevronRight color="#6366F1" size={16} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dismissButton}
              onPress={() => setIsStatsModalVisible(false)}
            >
              <Text style={styles.dismissButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  habitCardAchieved: {
    backgroundColor: '#0B132B',
    borderColor: '#F59E0B',
    borderWidth: 1.5,
    opacity: 0.9,
  },
  habitNameAchieved: {
    color: '#94A3B8',
    textDecorationLine: 'none',
    fontStyle: 'italic',
  },
  checkboxAchieved: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  streakBadgeAchieved: {
    backgroundColor: '#2F2205',
    borderColor: '#78350F',
    borderWidth: 1,
  },
  disabledActionButton: {
    opacity: 0.25,
  },
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#e3e3e3',
    letterSpacing: 2,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  historyTopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: '#1E1B4B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    // borderColor: '#312E81',
    marginBottom: 4,
  },
  historyTopButtonText: {
    color: '#C7D2FE',
    fontSize: 13,
    fontWeight: '600',
  },
  floatingAddButton: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 110,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  emptySubtext: {
    color: '#475569',
    fontSize: 14,
    marginTop: 6,
    textAlign: 'center',
  },
  habitCard: {
    backgroundColor: '#151F32',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  habitCardCompleted: {
    backgroundColor: '#0F172A',
    borderColor: '#10B981',
    opacity: 0.85,
  },
  habitMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  habitName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F8FAFC',
    flex: 1,
    lineHeight: 22,
  },
  habitNameCompleted: {
    color: '#64748B',
    textDecorationLine: 'line-through',
  },
  actionBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 12,
  },
  streakBadge: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  streakText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E2E8F0',
  },
  actionButtonsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconActionButton: {
    padding: 6,
    marginLeft: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 15, 0.85)',
    justifyContent: 'flex-end',
  },
  bottomSheetContainer: {
    backgroundColor: '#151F32',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  closeModalButton: {
    backgroundColor: '#1E293B',
    padding: 6,
    borderRadius: 50,
  },
  dateTimeRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tag: {
    flexDirection: 'row',
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#312E81',
  },
  tagText: {
    color: '#C7D2FE',
    fontSize: 12,
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#090D16',
    borderRadius: 14,
    padding: 16,
    color: '#FFF',
    fontSize: 16,
    fontWeight: '500',
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 20,
  },

  settingLabelText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  targetControlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#090D16',
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1E293B',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  controlCounterButton: {
    backgroundColor: '#2563EB',
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterValueDisplay: {
    alignItems: 'center',
  },
  counterValueNumber: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },
  counterValueLabel: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 1,
  },

  saveButton: {
    backgroundColor: '#6366F1',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#334155',
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalOverlayCenter: {
    flex: 1,
    backgroundColor: 'rgba(5, 8, 15, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  centerModalContainer: {
    width: '100%',
    backgroundColor: '#151F32',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  statsSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6366F1',
    letterSpacing: 1.5,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginTop: 4,
    textAlign: 'center',
  },
  statsDivider: {
    width: '40%',
    height: 2,
    backgroundColor: '#1E293B',
    marginVertical: 16,
  },

  circularDiskOuter: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#090D16',
    borderWidth: 4,
    borderColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 14,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
  },
  circularDiskInner: {
    width: 116,
    height: 116,
    borderRadius: 58,
    backgroundColor: '#1E1B4B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#312E81',
  },
  diskMetricsMain: {
    fontSize: 32,
    fontWeight: '800',
    color: '#10B981',
  },
  diskMetricsSub: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  statsInlineOverviewRow: {
    flexDirection: 'row',
    width: '100%',
    backgroundColor: '#090D16',
    borderRadius: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  subMiniStatCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  subMiniStatVal: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  subMiniStatLbl: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  metaText: {
    fontSize: 12,
    color: '#475569',
    marginTop: 16,
  },
  historyLinkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
  },
  historyLinkText: {
    color: '#C7D2FE',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  dismissButton: {
    marginTop: 16,
    padding: 8,
  },
  dismissButtonText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
  },

  habitTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  achievementBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  achievementText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F59E0B',
    marginHorizontal: 4,
  },
  inlineIcon: {
    transform: [{ translateY: -0.5 }],
  },

  streakTextAchieved: {
    color: '#F59E0B',
  },
  circularDiskAchieved: {
    borderColor: '#F59E0B',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 6,
  },
  circularDiskInnerAchieved: {
    backgroundColor: '#1E1B4B',
  },
  modalIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  diskMetricsMainAchieved: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FCD34D',
    letterSpacing: 0.5,
  },
  diskMetricsSubAchieved: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F59E0B',
    textTransform: 'uppercase',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  habitCardSkipped: {
    borderColor: 'rgba(244, 63, 94, 0.4)',
    backgroundColor: '#1A1016',
  },
  checkboxSkipped: {
    borderColor: 'transparent',
    backgroundColor: 'rgba(244, 63, 94, 0.15)',
  },

  habitNameSkipped: {
    color: '#FDA4AF',
  },

  skippedMetaText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#F43F5E',
    marginTop: 4,
  },
  streakBadgeSkipped: {
    backgroundColor: 'rgba(244, 63, 94, 0.12)',
  },
  streakTextSkipped: {
    color: '#F43F5E',
  },
  habitTitleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 4,
    flex: 1,
  },
  infoIconButton: {
    marginLeft: 10,
    padding: 4,
    backgroundColor: '#334155',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
