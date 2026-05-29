import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Calendar,
  TrendingUp,
  Award,
  Zap,
  Trophy,
  Medal,
} from 'lucide-react-native';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
import { useNavigation, useRoute } from '@react-navigation/native';

export default function History() {
  const route = useRoute();
  const { data } = route.params || {};
  const [historyLogs, sethistoryLogs] = useState([]);
  const navigation = useNavigation();

  const isGoalAchieved = data ? data.completedDays >= data.targetDays : false;

  useEffect(() => {
    if (!data?.createdAt) return;

    const start = dayjs(data.createdAt, 'MMM D, YYYY');
    const end = dayjs();
    const totalDays = end.diff(start, 'day');
    const logsArray = [];
    // console.log('>>', data);
    let loopconstrain = data?.targetDays;
    for (let i = 0; i <= totalDays; i++) {
      if (loopconstrain <= 0) {
        break;
      }
      const currentDay = start.add(i, 'day');
      const formattedDate = currentDay.format('MMM D, YYYY');
      const dayName = currentDay.format('dddd');
      const isCompleted = data?.habitsLog
        ? data.habitsLog.includes(formattedDate)
        : false;

      logsArray.unshift({
        id: i.toString(),
        date: formattedDate,
        dayName: dayName,
        isCompleted: isCompleted,
      });
      loopconstrain = loopconstrain - 1;
    }
    sethistoryLogs(logsArray);
  }, [data]);

  const renderHeaderAnalytics = () => (
    <View style={styles.analyticsSection}>
      <Text style={styles.habitTitle}>{data?.name || 'Loading . . .'}</Text>
      <Text style={styles.habitMetaSub}>Tracking since {data?.createdAt}</Text>

      {isGoalAchieved && (
        <View style={styles.celebrationBanner}>
          <View style={styles.celebrationIconRow}>
            <Trophy color="#F59E0B" size={28} strokeWidth={2.5} />
            <Medal
              color="#34D399"
              size={24}
              style={{ marginLeft: -8, marginTop: 10 }}
            />
          </View>
          <View style={styles.celebrationTextColumn}>
            <Text style={styles.celebrationTitle}>
              Hurray! Target Achieved! 🏆
            </Text>
            <Text style={styles.celebrationSubtitle}>
              You have successfully completed your habit milestone. Incredible
              consistency!
            </Text>
          </View>
        </View>
      )}

      <View style={styles.statsGrid}>
        <View
          style={[styles.statBox, isGoalAchieved && styles.statBoxAchieved]}
        >
          <Zap color={isGoalAchieved ? '#F59E0B' : '#10B981'} size={20} />
          <Text style={styles.statBoxValue}>{data?.completedDays} Days</Text>
          <Text style={styles.statBoxLabel}>Current Streak</Text>
        </View>

        <View
          style={[styles.statBox, isGoalAchieved && styles.statBoxAchieved]}
        >
          <TrendingUp
            color={isGoalAchieved ? '#F59E0B' : '#6366F1'}
            size={20}
          />
          <Text style={styles.statBoxValue}>
            {data?.targetDays
              ? Math.round((data.completedDays / data.targetDays) * 100)
              : 0}
            %
          </Text>
          <Text style={styles.statBoxLabel}>
            {isGoalAchieved ? 'Status: Done' : 'Complete'}
          </Text>
        </View>

        <View
          style={[styles.statBox, isGoalAchieved && styles.statBoxAchieved]}
        >
          <Award color="#F59E0B" size={20} />
          <Text style={styles.statBoxValue}>{data?.targetDays} Days</Text>
          <Text style={styles.statBoxLabel}>Global Target</Text>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Consistency Matrix</Text>
      <View style={styles.matrixContainer}>
        <View style={styles.matrixRow}>
          {historyLogs.map((e, index) => (
            <View
              key={index}
              style={[
                styles.matrixBlock,
                e.isCompleted
                  ? styles.matrixBlockDone
                  : styles.matrixBlockMissed,
              ]}
            />
          ))}
        </View>

        <View style={styles.matrixLegendRow}>
          <Text style={styles.legendText}>Older</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={[
                styles.matrixBlock,
                styles.matrixBlockDone,
                { width: 8, height: 8, marginRight: 4 },
              ]}
            />
            <Text style={[styles.legendText, { marginRight: 12 }]}>Done</Text>
            <View
              style={[
                styles.matrixBlock,
                styles.matrixBlockMissed,
                { width: 8, height: 8, marginRight: 4 },
              ]}
            />
            <Text style={styles.legendText}>Missed</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionLabel}>Routine Audit Logs</Text>
    </View>
  );

  const renderLogItem = ({ item }) => (
    <View
      style={[
        styles.logCard,
        item.isCompleted ? styles.logCardDone : styles.logCardMissed,
      ]}
    >
      <View style={styles.logLeftWrap}>
        <View
          style={[
            styles.iconIndicatorFrame,
            item.isCompleted ? styles.frameDone : styles.frameMissed,
          ]}
        >
          <Calendar
            color={item.isCompleted ? '#10B981' : '#F43F5E'}
            size={16}
          />
        </View>
        <View>
          <Text style={styles.logDateText}>{item.date}</Text>
          <Text style={styles.logDayText}>{item.dayName}</Text>
        </View>
      </View>

      <View style={styles.statusBadgeRow}>
        {item.isCompleted ? (
          <View style={[styles.statusBadge, styles.badgeDone]}>
            <CheckCircle2
              color="#10B981"
              size={14}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.statusBadgeText, { color: '#10B981' }]}>
              Completed
            </Text>
          </View>
        ) : (
          <View style={[styles.statusBadge, styles.badgeMissed]}>
            <XCircle color="#F43F5E" size={14} style={{ marginRight: 4 }} />
            <Text style={[styles.statusBadgeText, { color: '#F43F5E' }]}>
              Missed
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerNavigationBar}>
        <TouchableOpacity
          style={styles.backButtonFrame}
          activeOpacity={0.7}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <ArrowLeft color="#F8FAFC" size={20} />
        </TouchableOpacity>
        <Text style={styles.navBarTitle}>Performance Vault</Text>
        <View style={{ width: 40 }} />
      </View>

      <FlatList
        data={historyLogs}
        renderItem={renderLogItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={renderHeaderAnalytics}
        contentContainerStyle={styles.listScrollContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#090D16',
  },
  headerNavigationBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#1E293B',
  },
  backButtonFrame: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#151F32',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  navBarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  listScrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  analyticsSection: {
    paddingTop: 24,
  },
  habitTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFF',
    lineHeight: 32,
  },
  habitMetaSub: {
    fontSize: 13,
    color: '#475569',
    fontWeight: '500',
    marginTop: 4,
  },

  celebrationBanner: {
    flexDirection: 'row',
    backgroundColor: '#1E1B4B',
    borderColor: '#F59E0B',
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 16,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  celebrationIconRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginRight: 16,
    paddingBottom: 8,
  },
  celebrationTextColumn: {
    flex: 1,
  },
  celebrationTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  celebrationSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
    lineHeight: 18,
  },

  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#151F32',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  statBoxAchieved: {
    borderColor: 'rgba(245, 158, 11, 0.3)',
    backgroundColor: '#0B132B',
  },
  statBoxValue: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
  },
  statBoxLabel: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366F1',
    letterSpacing: 1,
    marginTop: 32,
    marginBottom: 14,
    textTransform: 'uppercase',
  },
  matrixContainer: {
    backgroundColor: '#151F32',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  matrixRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  matrixBlock: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  matrixBlockDone: {
    backgroundColor: '#10B981',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  matrixBlockMissed: {
    backgroundColor: '#1E293B',
    borderWidth: 1,
    borderColor: '#334155',
  },
  matrixLegendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
    paddingTop: 10,
  },
  legendText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '600',
  },
  logCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#151F32',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  logCardDone: {
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  logCardMissed: {
    borderColor: 'rgba(244, 63, 94, 0.15)',
  },
  logLeftWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconIndicatorFrame: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  frameDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  frameMissed: {
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
  },
  logDateText: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  logDayText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
  },
  statusBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  badgeDone: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  badgeMissed: {
    backgroundColor: 'rgba(244, 63, 94, 0.08)',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
});
